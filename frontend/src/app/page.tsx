import Link from "next/link";
import { ArrowRight, Zap, RefreshCw, Star } from "lucide-react";
import { ProductCard } from "@/components/pdp/ProductCard";

async function getProducts() {
  try {
    const res = await fetch("http://localhost:3001/api/v1/catalog/products", {
      next: { revalidate: 60 }, // Cache behavior for Next.js App Router
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }
    const data = await res.json();
    return data.data; // Formato de retorno do NestJS findAll
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = params?.q?.toLowerCase() || "";

  const allProducts = await getProducts();
  
  // Apply Search/Filter logic
  const products = allProducts.filter((p: any) => 
    !query || 
    p.name.toLowerCase().includes(query) || 
    p.brand?.toLowerCase().includes(query) || 
    p.category?.toLowerCase().includes(query)
  );

  const featuredProduct = allProducts.find((p: any) => p.isFeatured) || allProducts[0];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/images/background%20lightmode.jpeg')] dark:bg-[url('/images/background%20darkmode.jpeg')] bg-cover bg-center transition-all duration-700" />
          <div className="absolute inset-0 bg-background/60 dark:bg-background/60 backdrop-blur-sm" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center flex flex-col items-center">
          <span className="inline-block py-1 px-4 mb-6 bg-background/80 border border-border text-foreground font-semibold rounded-full text-xs uppercase tracking-widest backdrop-blur-md shadow-sm">
            E-commerce Enterprise
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6 tracking-tight max-w-4xl leading-tight drop-shadow-lg dark:drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]">
            Descubra o auge da <br /> <span className="text-primary drop-shadow-md">Tecnologia Premium</span>.
          </h1>
          <p className="text-xl text-foreground font-medium mb-10 max-w-2xl drop-shadow-md dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Seu próximo ecossistema começa aqui. Desempenho incomparável, entrega a jato e o programa de Recommerce mais recompensador.
          </p>
          {featuredProduct && (
            <Link 
              href={`/product/${featuredProduct.slug}`}
              className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold py-4 px-8 rounded-full text-lg hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,113,227,0.3)] hover:shadow-[0_0_25px_rgba(0,113,227,0.5)]"
            >
              Comprar {featuredProduct.name.split(" ")[0]}
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
        
        {/* Fade Gradient Mask Transition */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
      </section>

      {/* Dynamic Products Grid */}
      <section className="py-24 relative z-20 overflow-hidden">
        {/* Mesh Background */}
        <div className="absolute inset-0 bg-background z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0 pointer-events-none opacity-80" />
        
        <div className="container relative mx-auto px-4 z-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 relative z-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground to-primary/80 pb-1">
                {query ? `Resultados para "${params.q}"` : "Lançamentos em Destaque"}
              </h2>
              <p className="text-muted-foreground mt-2 font-medium">
                {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}.
              </p>
            </div>
            
            {/* Category Chips Desktop */}
            <div className="flex bg-background/60 backdrop-blur-md border border-border/60 p-1.5 rounded-full overflow-x-auto hide-scrollbar max-w-full shadow-sm">
              {[
                { label: "Todos", val: "" },
                { label: "Smartphones", val: "smartphones" },
                { label: "Laptops", val: "laptops" },
                { label: "Tablets", val: "tablets" },
                { label: "TVs", val: "televisores" },
              ].map(cat => (
                <Link 
                  key={cat.label} 
                  href={cat.val ? `/?q=${cat.val}` : '/'}
                  className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                    (query === cat.val) || (!query && !cat.val) 
                      ? 'bg-foreground text-background shadow-md' 
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product: any, index: number) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
            {products.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-12">
                Nenhum produto encontrado. Verifique se o backend está rodando em http://localhost:3000.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust & Features */}
      <section className="py-24 border-t border-border/50 bg-background text-center">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-foreground" />
            </div>
            <h4 className="text-xl font-bold mb-3">Omnichannel</h4>
            <p className="text-muted-foreground">Compre online, retire em 2 horas em qualquer loja ou peça frete ultra-rápido.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
              <RefreshCw className="w-8 h-8 text-foreground" />
            </div>
            <h4 className="text-xl font-bold mb-3">Recommerce Sustentável</h4>
            <p className="text-muted-foreground">Seu celular velho vale desconto na hora. Reduza o lixo eletrônico com facilidade.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
              <Star className="w-8 h-8 text-foreground" />
            </div>
            <h4 className="text-xl font-bold mb-3">Experiência Curada</h4>
            <p className="text-muted-foreground">Design premium e tecnologias de ponta selecionadas por especialistas no assunto.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
