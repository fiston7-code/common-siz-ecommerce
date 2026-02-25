'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Upload, Trash2, Image as ImageIcon, Star } from 'lucide-react';

interface ProductImage {
  url: string;
  is_primary: boolean;
}

interface ProductModalProps {
  product?: any;
  onClose: () => void;
  onSave: () => void;
}

export default function ProductModal({ product, onClose, onSave }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'smartphones',
    brand: '',
    stock_quantity: '0',
    stock_threshold: '5',
    specifications: {} as any,
  });
  
  const [images, setImages] = useState<ProductImage[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Champs de spécifications dynamiques
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: (product.price / 100).toString(),
        category: product.category || 'smartphones',
        brand: product.brand || '',
        stock_quantity: product.stock_quantity?.toString() || '0',
        stock_threshold: product.stock_threshold?.toString() || '5',
        specifications: product.specifications || {},
      });
      
      // Charger les images existantes
      if (product.images && Array.isArray(product.images)) {
        setImages(product.images);
      } else if (product.image_url) {
        // Fallback pour anciens produits avec image_url unique
        setImages([{ url: product.image_url, is_primary: true }]);
      }
    }
  }, [product]);

  // Upload d'image (peut être multiple)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Vérifier le nombre total d'images
    if (images.length + files.length > 5) {
      alert('Maximum 5 images par produit');
      return;
    }

    try {
      setUploading(true);

      // Upload de chaque fichier
      const uploadPromises = Array.from(files).map(async (file) => {
        // Vérifier le type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`Type de fichier non autorisé pour ${file.name}`);
        }

        // Vérifier la taille (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`Fichier ${file.name} trop volumineux (max 5MB)`);
        }

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Erreur upload');
        }

        const data = await response.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      // Ajouter les nouvelles images
      const newImages = uploadedUrls.map((url, index) => ({
        url,
        is_primary: images.length === 0 && index === 0, // La première image est primaire si c'est la première upload
      }));

      setImages([...images, ...newImages]);

      // Réinitialiser l'input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (err: any) {
      console.error('Erreur upload:', err);
      alert(err.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  // Définir comme image principale
  const setPrimaryImage = (index: number) => {
    setImages(images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    })));
  };

  // Supprimer une image
  const handleDeleteImage = async (index: number) => {
    if (!confirm('Supprimer cette image ?')) return;

    const imageToDelete = images[index];
    
    try {
      // Extraire le nom du fichier de l'URL Supabase
      if (imageToDelete.url.includes('product-images')) {
        const fileName = imageToDelete.url.split('/').pop();
        
        if (fileName) {
          const response = await fetch('/api/admin/upload', {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName }),
          });

          if (!response.ok) {
            console.error('Erreur suppression fichier');
          }
        }
      }

      // Retirer l'image de la liste
      const newImages = images.filter((_, i) => i !== index);
      
      // Si on supprime l'image primaire et qu'il reste des images, définir la première comme primaire
      if (imageToDelete.is_primary && newImages.length > 0) {
        newImages[0].is_primary = true;
      }
      
      setImages(newImages);

    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de la suppression');
    }
  };

  // Ajouter une URL manuellement
  const [manualUrl, setManualUrl] = useState('');
  
  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) return;
    
    if (images.length >= 5) {
      alert('Maximum 5 images par produit');
      return;
    }

    setImages([
      ...images,
      {
        url: manualUrl.trim(),
        is_primary: images.length === 0,
      },
    ]);
    
    setManualUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Debug: Vérifie ici si ton tableau contient quelque chose avant l'envoi
  console.log("Images à envoyer :", images);

  if (!formData.name || !formData.price || !formData.category) {
    alert('Veuillez remplir tous les champs obligatoires');
    return;
  }

  if (images.length === 0) {
    alert('Veuillez ajouter au moins une image');
    return;
  }

  try {
    setSaving(true);

    // Trouver l'image primaire
    const primaryImage = images.find(img => img.is_primary) || images[0];

    const payload = {
      ...formData,
     price: parseFloat(formData.price), 
  stock_quantity: parseInt(formData.stock_quantity),
  stock_threshold: parseInt(formData.stock_threshold),
  image_url: primaryImage.url,
  images: images,             // 👈 C'est ce tableau qui doit arriver dans ta colonne JSONB
    };

    console.log("Payload complet envoyé à l'API :", payload);

    const url = product
      ? `/api/admin/products/${product.id}`
      : '/api/admin/products';

    const response = await fetch(url, {
      method: product ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur de sauvegarde');
    }

    onSave();
  } catch (err: any) {
    console.error('Erreur détaillée:', err);
    alert(err.message || 'Erreur lors de la sauvegarde');
  } finally {
    setSaving(false);
  }
};

 

  const addSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      setFormData({
        ...formData,
        specifications: {
          ...formData.specifications,
          [specKey.trim()]: specValue.trim(),
        },
      });
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData({ ...formData, specifications: newSpecs });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Modifier le produit' : 'Nouveau produit'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Contenu */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Upload d'images (MULTI) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images du produit ({images.length}/5)
              </label>
              
              {/* Galerie d'images */}
              {images.length > 0 && (
                <div className="mb-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={`relative group rounded-lg overflow-hidden border-2 ${
                        image.is_primary ? 'border-blue-500' : 'border-gray-300'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`Image ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      
                      {/* Badge image principale */}
                      {image.is_primary && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Principale
                        </div>
                      )}

                      {/* Actions au survol */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        {!image.is_primary && (
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(index)}
                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs"
                            title="Définir comme principale"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(index)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Zone d'upload */}
              {images.length < 5 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageUpload}
                    multiple
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-3"></div>
                        <p className="text-sm text-gray-600">Upload en cours...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600">
                          Cliquez pour uploader des images
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, PNG, WEBP ou GIF (max. 5MB par image)
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Vous pouvez sélectionner plusieurs fichiers
                        </p>
                      </>
                    )}
                  </label>
                </div>
              )}

              {/* OU saisir URL manuellement */}
              {images.length < 5 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Ou ajoutez une URL :</p>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={manualUrl}
                      onChange={(e) => setManualUrl(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://exemple.com/image.jpg"
                    />
                    <button
                      type="button"
                      onClick={handleAddManualUrl}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="smartphones">📱 Smartphones</option>
                  <option value="laptops">💻 Laptops</option>
                  <option value="accessories">🎧 Accessoires</option>
                  <option value="tablets">📲 Tablettes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marque
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ex: Apple, Samsung..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (FC) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock disponible *
                </label>
                <input
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Décrivez votre produit..."
                />
              </div>
            </div>

            {/* Spécifications techniques */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spécifications techniques
              </label>
              
              {/* Affichage des specs existantes */}
              <div className="mb-3 space-y-2">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-700">{key}:</span>
                    <span className="text-sm text-gray-600">{value as string}</span>
                    <button
                      type="button"
                      onClick={() => removeSpecification(key)}
                      className="ml-auto text-red-600 hover:text-red-700 text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>

              {/* Ajouter une spec */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={specKey}
                  onChange={(e) => setSpecKey(e.target.value)}
                  placeholder="Clé (ex: RAM)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="text"
                  value={specValue}
                  onChange={(e) => setSpecValue(e.target.value)}
                  placeholder="Valeur (ex: 8 GB)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  type="button"
                  onClick={addSpecification}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Ajouter
                </button>
              </div>
            </div>

            {/* Seuil d'alerte stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seuil d'alerte stock
              </label>
              <input
                type="number"
                value={formData.stock_threshold}
                onChange={(e) => setFormData({ ...formData, stock_threshold: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Une alerte apparaîtra quand le stock sera inférieur ou égal à ce seuil
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Enregistrement...' : product ? 'Modifier' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
}