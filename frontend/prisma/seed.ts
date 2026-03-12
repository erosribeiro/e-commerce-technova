import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning old data...');
  // Clean order items first due to foreign keys
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventory.deleteMany();
  // We must disconnect wishlist before deleting products or users (Many-to-Many is handled automatically by deleteMany if we delete both, or CASCADE if configured, but deleteMany works)
  await prisma.product.deleteMany();
  await prisma.location.deleteMany();
  await prisma.tradeInProgram.deleteMany();
  await prisma.user.deleteMany();

  console.log('Start seeding...');

  // Create a default admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@ecommerce.com',
      name: 'Admin User',
      passwordHash: '$2a$12$KkQZ.s9N./5QG/oQv1w/wOfd7J2Q0p8tX1z4j4W4N3n/Z3A4B0yP2', // hashedPassword('admin123') just a mock
      role: UserRole.ADMIN,
    },
  });

  // Create physical locations
  const warehouse = await prisma.location.create({
    data: {
      name: 'Central Warehouse BR',
      type: 'RDC',
      address: 'Rodovia Anhanguera, km 15',
      zipCode: '05112-000',
      city: 'São Paulo',
      state: 'SP',
    },
  });

  const physicalStore = await prisma.location.create({
    data: {
      name: 'Shopping Morumbi Store',
      type: 'STORE',
      address: 'Av. Roque Petroni Júnior, 1089',
      zipCode: '04707-900',
      city: 'São Paulo',
      state: 'SP',
    },
  });

  // Products Data with Categories, Full Specs, and Local Images
  const productsData = [
    {
      name: 'iPhone 17e 256GB - Prata',
      slug: 'iphone-17e-256gb',
      description: 'Design refinado e performance inigualável. O iPhone 17e redefine a categoria premium com bordas mais finas e processamento avançado de imagem. O poderoso chip A18 garante que seus jogos e tarefas rodem na máxima eficiência.',
      basePrice: 6599.00,
      brand: 'Apple',
      category: 'Smartphones',
      imageUrls: [
        '/images/Iphone 17e - 1.jpg',
        '/images/Iphone 17e - 2.jpg',
        '/images/Iphone 17e - 3.jpg'
      ],
      specs: { 
        storage: '256GB', 
        ram: '8GB Unified Memory',
        color: 'Prata', 
        screen: '6.1-inch Super Retina XDR OLED',
        processor: 'A18 Bionic Chip',
        camera: 'Main 48MP + 12MP Ultra Wide | Front: 12MP TrueDepth',
        battery: 'Until 22 hours of video playback',
        os: 'iOS 18'
      },
      isFeatured: true,
    },
    {
      name: 'Samsung Galaxy S24 Ultra 512GB - Titânio Cinza',
      slug: 'samsung-galaxy-s24-ultra',
      description: 'O épico, agora turbinado com Galaxy AI. Pesquisa facilitada, tradução em tempo real e câmera de 200MP insuperável no escuro. Feito de titânio resistente e com a icônica S-Pen embutida.',
      basePrice: 8299.00,
      brand: 'Samsung',
      category: 'Smartphones',
      imageUrls: [
        '/images/Galaxy S24 - 1.jpg',
        '/images/Galaxy S24 - 2.jpg',
        '/images/Galaxy S24 - 3.jpg',
        '/images/Galaxy S24 - 4.jpg',
        '/images/Galaxy S24 - 5.jpg',
        '/images/Galaxy S24 - 6.jpg'
      ],
      specs: { 
        storage: '512GB', 
        ram: '12GB', 
        color: 'Titânio Cinza',
        screen: '6.8-inch Dynamic AMOLED 2X',
        processor: 'Snapdragon 8 Gen 3 for Galaxy',
        camera: '200MP Main + 50MP Periscope + 10MP Tele + 12MP Ultrawide | Front: 12MP',
        battery: '5000 mAh'
      },
      isFeatured: true,
    },
    {
      name: 'Samsung Galaxy Book4 Ultra',
      slug: 'samsung-galaxy-book4',
      description: 'A revolução do poder com a nova geração de processadores Intel Core Ultra 9. Equipado para suas tarefas mais pesadas e criação de conteúdo sem barreiras. Tela touch de ponta e placa de vídeo RTX 4070.',
      basePrice: 14999.00,
      brand: 'Samsung',
      category: 'Laptops',
      imageUrls: [
        '/images/Samsung Galaxy Book4 - 1.jpg',
        '/images/Samsung Galaxy Book4 - 2.jpg',
        '/images/Samsung Galaxy Book4 - 3.jpg'
      ],
      specs: { 
        cpu: 'Intel Core Ultra 9 185H', 
        gpu: 'NVIDIA GeForce RTX 4070 8GB',
        ram: '32GB LPDDR5X', 
        storage: '1TB NVMe SSD',
        screen: '16-inch Dynamic AMOLED 2X Touch',
        os: 'Windows 11 Home',
        weight: '1.86 kg'
      },
      isFeatured: false,
    },
    {
      name: 'Samsung Galaxy Tab S10 Ultra 512GB',
      slug: 'samsung-tablet-tab-s10',
      description: 'Tela imensa AMOLED Dinâmico de 14.6". Ferramenta definitiva para criatividade com a S Pen inclusa e modo DeX para produtividade em nível desktop. Resistência IP68 à água e poeira.',
      basePrice: 7999.00,
      brand: 'Samsung',
      category: 'Tablets',
      imageUrls: [
        '/images/Samsung Tablet Galaxy Tab S10 - 1.jpg',
        '/images/Samsung Tablet Galaxy Tab S10 - 2.jpg',
        '/images/Samsung Tablet Galaxy Tab S10 - 3.jpg'
      ],
      specs: { 
        screen: '14.6" Dynamic AMOLED 2X (120Hz)', 
        storage: '512GB', 
        ram: '12GB',
        pen: 'S Pen Inclusa',
        processor: 'MediaTek Dimensity 9300+',
        os: 'Android 14',
        battery: '11,200 mAh'
      },
      isFeatured: false,
    },
    {
      name: 'Smart TV 65" LG OLED evo 4K, C4 Design',
      slug: 'smart-tv-4k',
      description: 'Pretos perfeitos e contraste infinito. O painel OLED evo aprimorado pela inteligência artificial oferece uma imagem que beira a perfeição cinematográfica, com processador Alpha 9 Gen 7.',
      basePrice: 11499.00,
      brand: 'LG',
      category: 'Televisores',
      imageUrls: [
        '/images/Smart TV 4K - 1.jpg',
        '/images/Smart TV 4K - 2.jpg'
      ],
      specs: { 
        resolution: '4K Ultra HD (3840 x 2160)', 
        refreshRate: '144Hz (VRR)', 
        panel: 'OLED evo',
        processor: 'α9 AI Processor Gen7',
        smart: 'webOS 24',
        audio: 'Dolby Atmos, 40W 2.2 Canais',
        hdmi: '4x HDMI 2.1'
      },
      isFeatured: true,
    },
    {
      name: 'iPhone 11 128GB - Preto',
      slug: 'iphone-11-128gb',
      description: 'O iPhone 11 traz sistema de câmera dupla, bateria para o dia todo e vidro resistente.',
      basePrice: 2999.00,
      brand: 'Apple',
      category: 'Smartphones',
      imageUrls: [
        '/images/iphone 11 - 1.webp',
        '/images/iphone 11 - 2.webp',
        '/images/iphone 11 - 3.webp',
        '/images/iphone 11 - 4.webp'
      ],
      specs: { 
        storage: '128GB', 
        ram: '4GB',
        screen: '6.1-inch Liquid Retina HD',
        processor: 'A13 Bionic Chip',
        camera: 'Main 12MP Ultra Wide and Wide',
        battery: 'Until 17 hours of video playback',
        os: 'iOS'
      },
      isFeatured: false,
    },
    {
      name: 'iPhone 15 128GB',
      slug: 'iphone-15-128gb',
      description: 'Dynamic Island, câmera principal de 48MP e porta USB-C. O iPhone 15 traz um enorme salto em fotos e design.',
      basePrice: 5399.00,
      brand: 'Apple',
      category: 'Smartphones',
      imageUrls: [
        '/images/iphone 15 - 1.webp',
        '/images/iphone 15 - 2.webp',
        '/images/iphone 15 - 3.webp',
        '/images/iphone 15 - 4.webp',
        '/images/iphone 15 - 5.webp',
        '/images/iphone 15 - 6.webp',
        '/images/iphone 15 - 7.webp'
      ],
      specs: { 
        storage: '128GB', 
        ram: '6GB',
        screen: '6.1-inch Super Retina XDR OLED',
        processor: 'A16 Bionic',
        camera: '48MP Main + 12MP Ultra Wide',
        os: 'iOS'
      },
      isFeatured: false,
    },
    {
      name: 'iPhone 16 128GB',
      slug: 'iphone-16-128gb',
      description: 'Novo design, novo chip A18, botões de ação e controle de câmera dedicados. O iPhone 16 é incrivelmente rápido e eficiente.',
      basePrice: 6299.00,
      brand: 'Apple',
      category: 'Smartphones',
      imageUrls: [
        '/images/iphone 16 - 1.jpg',
        '/images/iphone 16 - 2.jpg',
        '/images/iphone 16 - 3.jpg',
        '/images/iphone 16 - 4.jpg'
      ],
      specs: { 
        storage: '128GB', 
        ram: '8GB',
        screen: '6.1-inch Super Retina XDR',
        processor: 'A18 Bionic',
        camera: '48MP Fusion + 12MP Ultra Wide',
        os: 'iOS 18'
      },
      isFeatured: true,
    },
    {
      name: 'iPhone 16e 128GB',
      slug: 'iphone-16e-128gb',
      description: 'O que você precisa, por menos. O iPhone 16e traz a essência da linha 16 em um pacote mais acessível sem abrir mão do que importa.',
      basePrice: 4999.00,
      brand: 'Apple',
      category: 'Smartphones',
      imageUrls: [
        '/images/iphone 16e - 1.jpg',
        '/images/iphone 16e - 2.jpg',
        '/images/iphone 16e - 3.jpg',
        '/images/iphone 16e - 4.jpg'
      ],
      specs: { 
        storage: '128GB', 
        ram: '8GB',
        screen: '6.1-inch Display',
        processor: 'A18 Bionic',
        camera: '48MP Fusion',
        os: 'iOS 18'
      },
      isFeatured: false,
    },
    {
      name: 'Notebook Acer Nitro V15',
      slug: 'notebook-acer-nitro-v15',
      description: 'Desempenho máximo para seus jogos com RTX 4050 e processador Intel Core i5 ou i7 de 13ª geração. Tela de 144Hz para fluidez extrema.',
      basePrice: 5199.00,
      brand: 'Acer',
      category: 'Laptops',
      imageUrls: [
        '/images/Notebook Acer Nitro V15 - 1.jpg',
        '/images/Notebook Acer Nitro V15 - 2.jpg',
        '/images/Notebook Acer Nitro V15 - 3.jpg',
        '/images/Notebook Acer Nitro V15 - 4.jpg',
        '/images/Notebook Acer Nitro V15 - 5.jpg'
      ],
      specs: { 
        cpu: 'Intel Core i5-13420H', 
        gpu: 'NVIDIA GeForce RTX 4050 6GB',
        ram: '8GB DDR5', 
        storage: '512GB NVMe SSD',
        screen: '15.6-inch FHD IPS 144Hz',
        os: 'Windows 11 Home',
        weight: '2.11 kg'
      },
      isFeatured: false,
    },
    {
      name: 'Macbook Air M3 2025',
      slug: 'macbook-air-2025',
      description: 'Superleve, superrápido com o chip M3. O MacBook Air é perfeito para trabalhar, jogar e criar em qualquer lugar com bateria incansável.',
      basePrice: 10999.00,
      brand: 'Apple',
      category: 'Laptops',
      imageUrls: [
        '/images/macbook air 2025 - 1.jpg',
        '/images/macbook air 2025 - 2.jpg',
        '/images/macbook air 2025 - 3.jpg'
      ],
      specs: { 
        cpu: 'Apple M3 chip with 8-core CPU', 
        gpu: '10-core GPU',
        ram: '8GB Unified Memory', 
        storage: '256GB SSD',
        screen: '13.6-inch Liquid Retina display',
        os: 'macOS Sequoia'
      },
      isFeatured: true,
    },
    {
      name: 'Monitor Gamer AOC 24G2 120Hz',
      slug: 'monitor-aoc-120hz',
      description: 'Jogue como um profissional com o Monitor Gamer AOC. Taxa de atualização de 120Hz e painel IPS para cores vivas e tempo de resposta rápido.',
      basePrice: 1099.00,
      brand: 'AOC',
      category: 'Acessórios',
      imageUrls: [
        '/images/monitor AOC 120hz - 1.jpg',
        '/images/monitor AOC 120hz - 2.jpg',
        '/images/monitor AOC 120hz - 3.jpg',
        '/images/monitor AOC 120hz - 4.jpg',
        '/images/monitor AOC 120hz - 5.jpg',
        '/images/monitor AOC 120hz - 6.jpg'
      ],
      specs: { 
        screen: '23.8-inch IPS',
        resolution: 'FHD 1920x1080',
        refreshRate: '120Hz',
        response: '1ms',
        ports: 'HDMI, DisplayPort'
      },
      isFeatured: false,
    },
    {
      name: 'Monitor Gamer AOC 180Hz',
      slug: 'monitor-aoc-180hz',
      description: 'A vantagem que você precisa. Painel super rápido de 180Hz G-SYNC Compatible, tempo de resposta baixo e design incrível.',
      basePrice: 1499.00,
      brand: 'AOC',
      category: 'Acessórios',
      imageUrls: [
        '/images/monitor AOC 180hz - 1.jpg',
        '/images/monitor AOC 180hz - 2.jpg',
        '/images/monitor AOC 180hz - 3.jpg',
        '/images/monitor AOC 180hz - 4.jpg'
      ],
      specs: { 
        screen: '27-inch Fast IPS',
        resolution: 'FHD 1920x1080',
        refreshRate: '180Hz',
        response: '0.5ms',
        ports: '2x HDMI 2.0, 1x DisplayPort 1.4'
      },
      isFeatured: false,
    }
  ];

  for (const pData of productsData) {
    const product = await prisma.product.create({
      data: pData,
    });
    console.log(`Created product: ${product.name}`);

    // Add inventory
    await prisma.inventory.create({
      data: {
        productId: product.id,
        locationId: warehouse.id,
        quantity: Math.floor(Math.random() * 50) + 15,
      },
    });

    await prisma.inventory.create({
      data: {
        productId: product.id,
        locationId: physicalStore.id,
        quantity: Math.floor(Math.random() * 15) + 3,
      },
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
