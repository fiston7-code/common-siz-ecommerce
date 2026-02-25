import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface UpdateProductData {
  updated_at: string;
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  brand?: string;
  specifications?: Record<string, unknown>;
  image_url?: string;
  images?: { url: string; is_primary: boolean }[];// array of image URLs
  stock_quantity?: number;
  stock_threshold?: number;
  is_available?: boolean;
}

// PATCH - Modifier un produit
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const productId = params.id;

  try {
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      name, 
      description, 
      price, 
      category, 
      brand, 
      specifications, 
      image_url,
      images, // Array d'images
      stock_quantity,
      stock_threshold,
      is_available
    } = body;

    // Valider la catégorie si fournie
    if (category) {
      const validCategories = ['smartphones', 'laptops', 'accessories', 'tablets'];
      if (!validCategories.includes(category)) {
        return NextResponse.json(
          { error: 'Catégorie invalide' },
          { status: 400 }
        );
      }
    }

    // Préparer les données de mise à jour
    const updateData: UpdateProductData = { updated_at: new Date().toISOString() };
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Math.round(price * 100);
    if (category !== undefined) updateData.category = category;
    if (brand !== undefined) updateData.brand = brand;
    if (specifications !== undefined) updateData.specifications = specifications;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (images !== undefined) updateData.images = images; // ⬅️ Ajoute cette ligne
    if (stock_quantity !== undefined) updateData.stock_quantity = stock_quantity;
    if (stock_threshold !== undefined) updateData.stock_threshold = stock_threshold;
    if (is_available !== undefined) updateData.is_available = is_available;

    const { data: product, error: productError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId)
      .select()
      .single();

    if (productError) {
      console.error('Erreur update produit:', productError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });

  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un produit
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Vérification du token (sécurité)
    const token = request.cookies.get('admin_token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}