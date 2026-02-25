import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Liste des produits
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur fetch products:', error);
      return NextResponse.json(
        { error: 'Erreur lors du chargement' },
        { status: 500 }
      );
    }

    return NextResponse.json({ products });

  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau produit
export async function POST(request: NextRequest) {
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
      stock_threshold
    } = body;

    // Valider les données
    if (!name || !price || !category) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      );
    }

    // Valider la catégorie
    const validCategories = ['smartphones', 'laptops', 'accessories', 'tablets'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Catégorie invalide' },
        { status: 400 }
      );
    }

    // Créer le produit avec les images dans la colonne JSONB
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        name,
        description: description || null,
        price: Math.round(price * 100),
        category,
        brand: brand || null,
        specifications: specifications || null,
        image_url: image_url || null,
        images: images || [], // ⬅️ Stocke directement dans la colonne JSONB
        stock_quantity: stock_quantity || 0,
        stock_threshold: stock_threshold || 5,
        is_available: true,
      })
      .select()
      .single();

    if (productError) {
      console.error('Erreur création produit:', productError);
      return NextResponse.json(
        { error: 'Erreur lors de la création' },
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