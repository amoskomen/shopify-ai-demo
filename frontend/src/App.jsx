import React, { useEffect, useState } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // FETCH PRODUCTS WITH CACHE BUSTER
  const fetchProducts = () => {
    setIsRefreshing(true);
    // Added ?t= timestamp to force the browser to bypass cache and get fresh Shopify data
    fetch(`http://localhost:5000/api/products?t=${Date.now()}`)
      .then(res => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setIsRefreshing(false);
        console.log("🔄 Data synced with Shopify");
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setIsRefreshing(false);
      });
  };

  useEffect(() => { 
    fetchProducts(); 
  }, []);

  const handleOptimize = async (id, title) => {
    setLoadingId(id);
    try {
      const response = await fetch('http://localhost:5000/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title })
      });

      if (!response.ok) throw new Error("Optimization failed");

      // We wait 2.5 seconds to allow Shopify's database to finish indexing the new metadata
      setTimeout(() => {
        fetchProducts();
        setLoadingId(null);
      }, 2500);

    } catch (e) { 
      alert("Error optimizing: " + e.message); 
      setLoadingId(null);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Shopify <span style={{ color: '#008060' }}>AI Agent</span></h1>
        <button 
          onClick={fetchProducts} 
          disabled={isRefreshing}
          style={{ 
            cursor: isRefreshing ? 'not-allowed' : 'pointer', 
            padding: '10px 20px', 
            borderRadius: '6px', 
            border: '1px solid #ddd', 
            background: '#fff',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {isRefreshing ? '⌛ Syncing...' : '🔄 Refresh Dashboard'}
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
        {products.length > 0 ? products.map(p => (
          <div key={p.id} style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '18px', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column' }}>
            <img 
              src={p.images?.nodes?.[0]?.url || 'https://via.placeholder.com/300x200?text=No+Image'} 
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }} 
              alt={p.title}
            />
            
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{p.title}</h3>
            
            <div style={{ marginBottom: '15px', flexGrow: 1 }}>
              <strong style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI Generated Description:</strong>
              <div 
                style={{ fontSize: '14px', color: '#444', marginTop: '5px', minHeight: '40px', lineHeight: '1.5' }}
                dangerouslySetInnerHTML={{ __html: p.descriptionHtml || '<em style="color:#ccc">No description yet...</em>' }}
              />
            </div>

            <div style={{ fontSize: '12px', color: '#008060', fontWeight: 'bold', marginBottom: '15px', background: '#f0fdf4', padding: '8px 12px', borderRadius: '6px', border: '1px solid #dcfce7' }}>
              🏷️ Tags: {p.tags?.length > 0 ? p.tags.join(', ') : 'None'}
            </div>
            
            <button 
              onClick={() => handleOptimize(p.id, p.title)}
              disabled={loadingId === p.id}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
                background: loadingId === p.id ? '#ccc' : '#008060', color: '#fff', 
                cursor: loadingId === p.id ? 'not-allowed' : 'pointer', 
                fontWeight: 'bold', fontSize: '14px', transition: 'all 0.2s'
              }}
            >
              {loadingId === p.id ? '🤖 AI Agent Working...' : '✨ Optimize with AI'}
            </button>
          </div>
        )) : (
          <p style={{ textAlign: 'center', gridColumn: '1/-1', padding: '50px', color: '#666' }}>
            No products found in amos-ai-demo.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
