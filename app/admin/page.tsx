export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Tableau de bord
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card Commandes */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Commandes du jour</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">24</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>

        {/* Card Revenus */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenus du jour</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">1 245€</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        {/* Card Clients */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Nouveaux clients</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        {/* Card Produits */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Produits en stock</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">156</p>
            </div>
            <div className="text-4xl">🛍️</div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Commandes récentes
        </h2>
        <p className="text-gray-500">Les commandes s&apos;afficheront ici...</p>
      </div>
    </div>
  );
}