import { currentDate } from "../utils/formatters.js";

function daysFromToday(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function movement(id, type, quantity, note, offset) {
  return {
    id,
    type,
    quantity,
    note,
    date: daysFromToday(offset)
  };
}

export function createSeedData() {
  const customers = [
    {
      id: "cli-1",
      name: "Rafael Martins",
      phone: "(12) 98888-1020",
      whatsapp: "(12) 98888-1020",
      taxId: "123.456.789-00",
      address: "Rua das Oficinas, 120 - Sao Sebastiao/SP",
      notes: "Cliente fiel, motoboy da regiao."
    },
    {
      id: "cli-2",
      name: "Juliana Costa",
      phone: "(12) 97777-2030",
      whatsapp: "(12) 97777-2030",
      taxId: "",
      address: "Av. Litoral, 450 - Sao Sebastiao/SP",
      notes: "Prefere aprovacao por WhatsApp."
    },
    {
      id: "cli-3",
      name: "Carlos Henrique",
      phone: "(12) 96666-3040",
      whatsapp: "(12) 96666-3040",
      taxId: "987.654.321-00",
      address: "Travessa Pescador, 18 - Ilhabela/SP",
      notes: "Costuma fazer revisoes preventivas."
    },
    {
      id: "cli-4",
      name: "Fernanda Souza",
      phone: "(12) 95555-4050",
      whatsapp: "(12) 95555-4050",
      taxId: "",
      address: "Rua do Porto, 70 - Caraguatatuba/SP",
      notes: "Usa a moto para deslocamento diario."
    },
    {
      id: "cli-5",
      name: "Anderson Lima",
      phone: "(12) 94444-5060",
      whatsapp: "(12) 94444-5060",
      taxId: "12.345.678/0001-10",
      address: "Alameda Central, 510 - Sao Sebastiao/SP",
      notes: "Compra pecas para pequena frota."
    }
  ];

  const bikes = [
    {
      id: "moto-1",
      customerId: "cli-1",
      brand: "Honda",
      model: "CG 160 Titan",
      year: "2023",
      plate: "FTR-9A21",
      color: "Vermelha",
      mileage: "18500",
      notes: "Em uso intenso para entregas."
    },
    {
      id: "moto-2",
      customerId: "cli-2",
      brand: "Yamaha",
      model: "Fazer 250",
      year: "2022",
      plate: "QPL-7C18",
      color: "Azul",
      mileage: "14200",
      notes: "Cliente relatou vibracao na dianteira."
    },
    {
      id: "moto-3",
      customerId: "cli-3",
      brand: "Honda",
      model: "Biz 125",
      year: "2020",
      plate: "RZT-4D09",
      color: "Branca",
      mileage: "22340",
      notes: "Moto usada para trajetos curtos."
    },
    {
      id: "moto-4",
      customerId: "cli-4",
      brand: "Suzuki",
      model: "Yes 125",
      year: "2019",
      plate: "MTR-5E44",
      color: "Preta",
      mileage: "30110",
      notes: "Necessita atencao em cabos."
    },
    {
      id: "moto-5",
      customerId: "cli-5",
      brand: "Honda",
      model: "NXR Bros 160",
      year: "2024",
      plate: "KLP-2B67",
      color: "Laranja",
      mileage: "8900",
      notes: "Cliente exige liberacao rapida."
    }
  ];

  const inventory = [
    {
      id: "prd-1",
      name: "Oleo 10W30",
      sku: "OL10W30",
      category: "Lubrificantes",
      quantity: 12,
      minStock: 8,
      costPrice: 22,
      salePrice: 35,
      supplier: "Moto Supply",
      location: "Prateleira A1",
      priceHistory: [{ date: daysFromToday(-20), costPrice: 22, salePrice: 35 }],
      movements: [movement("mov-1", "entrada", 20, "Compra inicial", -20), movement("mov-2", "saida", 8, "Vendas e OS", -3)]
    },
    {
      id: "prd-2",
      name: "Pastilha de freio dianteira",
      sku: "PFD-001",
      category: "Freios",
      quantity: 4,
      minStock: 5,
      costPrice: 28,
      salePrice: 55,
      supplier: "Moto Parts Brasil",
      location: "Prateleira B2",
      priceHistory: [{ date: daysFromToday(-25), costPrice: 28, salePrice: 55 }],
      movements: [movement("mov-3", "entrada", 10, "Compra inicial", -25), movement("mov-4", "saida", 6, "Uso em servicos", -4)]
    },
    {
      id: "prd-3",
      name: "Kit relacao CG 160",
      sku: "KRCG160",
      category: "Transmissao",
      quantity: 3,
      minStock: 2,
      costPrice: 145,
      salePrice: 245,
      supplier: "Coroa Forte",
      location: "Prateleira C1",
      priceHistory: [{ date: daysFromToday(-15), costPrice: 145, salePrice: 245 }],
      movements: [movement("mov-5", "entrada", 5, "Compra inicial", -15), movement("mov-6", "saida", 2, "Uso em servicos", -5)]
    },
    {
      id: "prd-4",
      name: "Filtro de ar Biz 125",
      sku: "FABIZ125",
      category: "Filtros",
      quantity: 7,
      minStock: 4,
      costPrice: 18,
      salePrice: 32,
      supplier: "Filtro Max",
      location: "Prateleira A3",
      priceHistory: [{ date: daysFromToday(-18), costPrice: 18, salePrice: 32 }],
      movements: [movement("mov-7", "entrada", 10, "Compra inicial", -18), movement("mov-8", "saida", 3, "Uso em servicos", -2)]
    },
    {
      id: "prd-5",
      name: "Cabo de embreagem",
      sku: "CABO-EMB",
      category: "Cabos",
      quantity: 2,
      minStock: 4,
      costPrice: 19,
      salePrice: 39,
      supplier: "Cabos Center",
      location: "Prateleira D1",
      priceHistory: [{ date: daysFromToday(-22), costPrice: 19, salePrice: 39 }],
      movements: [movement("mov-9", "entrada", 6, "Compra inicial", -22), movement("mov-10", "saida", 4, "Uso em servicos", -6)]
    },
    {
      id: "prd-6",
      name: "Bateria 5Ah",
      sku: "BAT-5AH",
      category: "Eletrica",
      quantity: 6,
      minStock: 3,
      costPrice: 120,
      salePrice: 185,
      supplier: "Moto Eletrica",
      location: "Armario 2",
      priceHistory: [{ date: daysFromToday(-30), costPrice: 120, salePrice: 185 }],
      movements: [movement("mov-11", "entrada", 8, "Compra inicial", -30), movement("mov-12", "saida", 2, "Venda balcão", -8)]
    },
    {
      id: "prd-7",
      name: "Pneu traseiro 90/90",
      sku: "PNEU-9090",
      category: "Pneus",
      quantity: 5,
      minStock: 2,
      costPrice: 180,
      salePrice: 295,
      supplier: "Pneu Rapido",
      location: "Estoque alto",
      priceHistory: [{ date: daysFromToday(-12), costPrice: 180, salePrice: 295 }],
      movements: [movement("mov-13", "entrada", 6, "Compra inicial", -12), movement("mov-14", "saida", 1, "Venda balcão", -2)]
    },
    {
      id: "prd-8",
      name: "Lampada farol H4",
      sku: "H4-12V",
      category: "Iluminacao",
      quantity: 9,
      minStock: 5,
      costPrice: 12,
      salePrice: 24,
      supplier: "Luz Moto",
      location: "Prateleira B1",
      priceHistory: [{ date: daysFromToday(-14), costPrice: 12, salePrice: 24 }],
      movements: [movement("mov-15", "entrada", 15, "Compra inicial", -14), movement("mov-16", "saida", 6, "Uso em servicos", -1)]
    }
  ];

  const quotes = [
    {
      id: "orc-1",
      customerId: "cli-2",
      bikeId: "moto-2",
      serviceDescription: "Troca do kit relacao, alinhamento e revisao de freios.",
      partItems: [
        { inventoryId: "prd-2", name: "Pastilha de freio dianteira", quantity: 1, unitPrice: 55 },
        { inventoryId: "prd-3", name: "Kit relacao CG 160", quantity: 1, unitPrice: 245 }
      ],
      partsValue: 300,
      laborValue: 180,
      discount: 20,
      total: 460,
      status: "Em aberto",
      date: daysFromToday(-3),
      validUntil: daysFromToday(4),
      notes: "Cliente pediu prazo curto para entrega."
    },
    {
      id: "orc-2",
      customerId: "cli-3",
      bikeId: "moto-3",
      serviceDescription: "Limpeza de carburador, troca de filtro e regulagem.",
      partItems: [
        { inventoryId: "prd-4", name: "Filtro de ar Biz 125", quantity: 1, unitPrice: 32 }
      ],
      partsValue: 32,
      laborValue: 120,
      discount: 0,
      total: 152,
      status: "Aprovado",
      date: daysFromToday(-6),
      validUntil: daysFromToday(2),
      notes: "Aprovado por WhatsApp."
    },
    {
      id: "orc-3",
      customerId: "cli-4",
      bikeId: "moto-4",
      serviceDescription: "Troca de cabos e revisao eletrica basica.",
      partItems: [
        { inventoryId: "prd-5", name: "Cabo de embreagem", quantity: 1, unitPrice: 39 },
        { inventoryId: "prd-8", name: "Lampada farol H4", quantity: 1, unitPrice: 24 }
      ],
      partsValue: 63,
      laborValue: 130,
      discount: 10,
      total: 183,
      status: "Recusado",
      date: daysFromToday(-9),
      validUntil: daysFromToday(-2),
      notes: "Cliente achou o prazo alto."
    },
    {
      id: "orc-4",
      customerId: "cli-5",
      bikeId: "moto-5",
      serviceDescription: "Revisao de 10 mil km com troca de oleo e filtros.",
      partItems: [
        { inventoryId: "prd-1", name: "Oleo 10W30", quantity: 2, unitPrice: 35 },
        { inventoryId: "prd-4", name: "Filtro de ar Biz 125", quantity: 1, unitPrice: 32 }
      ],
      partsValue: 102,
      laborValue: 160,
      discount: 12,
      total: 250,
      status: "Em aberto",
      date: daysFromToday(-1),
      validUntil: daysFromToday(7),
      notes: "Cliente corporativo, pode virar recorrente."
    }
  ];

  const orders = [
    {
      id: "os-1",
      quoteId: null,
      customerId: "cli-1",
      bikeId: "moto-1",
      service: "Revisao geral com troca de oleo, filtros e regulagem.",
      mechanic: "Marcos Silva",
      entryDate: daysFromToday(-4),
      dueDate: daysFromToday(-1),
      completionDate: daysFromToday(-1),
      status: "Finalizado",
      partItems: [{ inventoryId: "prd-1", name: "Oleo 10W30", quantity: 2, unitPrice: 35 }],
      partsValue: 70,
      laborValue: 180,
      total: 250,
      beforePhotos: ["cg160-antes.jpg"],
      afterPhotos: ["cg160-depois.jpg"],
      documents: ["checklist-entrega.pdf"],
      internalNotes: "Cliente aprovou servico completo.",
      customerNotes: "Moto pronta para entregas.",
      notifiedAt: `${daysFromToday(-1)}T15:10:00`,
      financialPosted: true
    },
    {
      id: "os-2",
      quoteId: "orc-2",
      customerId: "cli-3",
      bikeId: "moto-3",
      service: "Limpeza de carburador, troca de filtro e regulagem.",
      mechanic: "Aline Rocha",
      entryDate: daysFromToday(-2),
      dueDate: daysFromToday(1),
      completionDate: "",
      status: "Aguardando peca",
      partItems: [{ inventoryId: "prd-4", name: "Filtro de ar Biz 125", quantity: 1, unitPrice: 32 }],
      partsValue: 32,
      laborValue: 120,
      total: 152,
      beforePhotos: ["biz-entrada.jpg"],
      afterPhotos: [],
      documents: ["orcamento-biz.pdf"],
      internalNotes: "Aguardando retorno do fornecedor sobre item secundario.",
      customerNotes: "Moto em diagnostico fino.",
      notifiedAt: "",
      financialPosted: false
    },
    {
      id: "os-3",
      quoteId: null,
      customerId: "cli-2",
      bikeId: "moto-2",
      service: "Diagnostico eletrico e troca do conjunto frontal.",
      mechanic: "Paulo Menezes",
      entryDate: daysFromToday(-1),
      dueDate: daysFromToday(2),
      completionDate: "",
      status: "Em andamento",
      partItems: [{ inventoryId: "prd-8", name: "Lampada farol H4", quantity: 2, unitPrice: 24 }],
      partsValue: 48,
      laborValue: 140,
      total: 188,
      beforePhotos: ["fazer-frente.jpg"],
      afterPhotos: [],
      documents: [],
      internalNotes: "Verificar chicote se falha persistir.",
      customerNotes: "Atualizacao sera enviada hoje.",
      notifiedAt: "",
      financialPosted: false
    },
    {
      id: "os-4",
      quoteId: null,
      customerId: "cli-5",
      bikeId: "moto-5",
      service: "Troca de pneu traseiro e alinhamento.",
      mechanic: "Marcos Silva",
      entryDate: daysFromToday(-7),
      dueDate: daysFromToday(-5),
      completionDate: daysFromToday(-5),
      status: "Finalizado",
      partItems: [{ inventoryId: "prd-7", name: "Pneu traseiro 90/90", quantity: 1, unitPrice: 295 }],
      partsValue: 295,
      laborValue: 95,
      total: 390,
      beforePhotos: ["bros-pneu-antes.jpg"],
      afterPhotos: ["bros-pneu-depois.jpg"],
      documents: ["ordem-bros.pdf"],
      internalNotes: "Entrega realizada no prazo.",
      customerNotes: "Pneu novo instalado e calibrado.",
      notifiedAt: `${daysFromToday(-5)}T17:00:00`,
      financialPosted: true
    },
    {
      id: "os-5",
      quoteId: null,
      customerId: "cli-4",
      bikeId: "moto-4",
      service: "Revisao de cabos, embreagem e freio traseiro.",
      mechanic: "Aline Rocha",
      entryDate: currentDate(),
      dueDate: daysFromToday(3),
      completionDate: "",
      status: "Em andamento",
      partItems: [{ inventoryId: "prd-5", name: "Cabo de embreagem", quantity: 1, unitPrice: 39 }],
      partsValue: 39,
      laborValue: 150,
      total: 189,
      beforePhotos: ["yes-inspecao.jpg"],
      afterPhotos: [],
      documents: [],
      internalNotes: "Cliente pediu retorno antes de trocar itens extras.",
      customerNotes: "Moto em revisao.",
      notifiedAt: "",
      financialPosted: false
    }
  ];

  const finance = [
    {
      id: "fin-1",
      date: daysFromToday(-1),
      type: "entrada",
      category: "OS Finalizada",
      description: "Recebimento OS #os-1",
      amount: 250,
      status: "Pago",
      sourceOrderId: "os-1"
    },
    {
      id: "fin-2",
      date: daysFromToday(-5),
      type: "entrada",
      category: "OS Finalizada",
      description: "Recebimento OS #os-4",
      amount: 390,
      status: "Pago",
      sourceOrderId: "os-4"
    },
    {
      id: "fin-3",
      date: daysFromToday(-2),
      type: "saida",
      category: "Compra de estoque",
      description: "Reposicao de lubrificantes e filtros",
      amount: 420,
      status: "Pago",
      sourceOrderId: null
    },
    {
      id: "fin-4",
      date: currentDate(),
      type: "saida",
      category: "Despesa operacional",
      description: "Energia, agua e pequenas despesas",
      amount: 185,
      status: "Pagar",
      sourceOrderId: null
    }
  ];

  const agenda = [
    {
      id: "age-1",
      customerId: "cli-1",
      bikeId: "moto-1",
      service: "Revisao de 20 mil km",
      date: daysFromToday(1),
      time: "09:00",
      dueDate: daysFromToday(1),
      status: "Agendado"
    },
    {
      id: "age-2",
      customerId: "cli-2",
      bikeId: "moto-2",
      service: "Troca de kit relacao",
      date: daysFromToday(2),
      time: "11:30",
      dueDate: daysFromToday(2),
      status: "Agendado"
    },
    {
      id: "age-3",
      customerId: "cli-5",
      bikeId: "moto-5",
      service: "Entrega pos-revisao",
      date: daysFromToday(3),
      time: "16:00",
      dueDate: daysFromToday(3),
      status: "Em andamento"
    },
    {
      id: "age-4",
      customerId: "cli-3",
      bikeId: "moto-3",
      service: "Avaliacao de partida",
      date: daysFromToday(4),
      time: "14:00",
      dueDate: daysFromToday(4),
      status: "Agendado"
    }
  ];

  const users = [
    {
      id: "usr-1",
      name: "Marcelo Prime",
      email: "marcelo@motoprime.com",
      role: "Gestor",
      profile: "Administrador",
      status: "Ativo"
    },
    {
      id: "usr-2",
      name: "Ana Atendimento",
      email: "ana@motoprime.com",
      role: "Recepcao",
      profile: "Atendente",
      status: "Ativo"
    },
    {
      id: "usr-3",
      name: "Diego Oficina",
      email: "diego@motoprime.com",
      role: "Mecanico Senior",
      profile: "Mecanico",
      status: "Ativo"
    }
  ];

  const settings = {
    shopName: "Neguinho Acessórios",
    whatsapp: "(12) 99999-9999",
    address: "São Sebastião/SP",
    primaryColor: "#c61f1f",
    accentColor: "#111111",
    logoText: "Neguinho Acessórios"
  };

  return {
    customers,
    bikes,
    inventory,
    quotes,
    orders,
    finance,
    agenda,
    users,
    settings,
    meta: {
      seededAt: new Date().toISOString()
    }
  };
}
