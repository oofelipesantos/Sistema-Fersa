import type {
  DashboardMetrics,
  IssueCategory,
  KnownIssue,
  Product,
  Ticket
} from "@/types/domain";

export const mockProducts: Product[] = [
  {
    id: "product-f15123",
    partNumber: "F15123",
    family: "Wheel Hub",
    active: true,
    translations: {
      "pt-BR": {
        name: "Rolamento de roda F15123",
        description: "Conjunto de rolamento para aplicações de carga média.",
        application: "Eixo dianteiro de veículos comerciais",
        features: [
          "Aço de alta resistência",
          "Vedação reforçada",
          "Lubrificação de longa duração"
        ]
      },
      es: {
        name: "Rodamiento de rueda F15123",
        description: "Conjunto de rodamiento para aplicaciones de carga media.",
        application: "Eje delantero de vehículos comerciales",
        features: [
          "Acero de alta resistencia",
          "Sellado reforzado",
          "Lubricación de larga duración"
        ]
      },
      en: {
        name: "F15123 wheel bearing",
        description: "Bearing assembly for medium-load applications.",
        application: "Commercial vehicle front axle",
        features: [
          "High-strength steel",
          "Reinforced seal",
          "Long-life lubrication"
        ]
      }
    },
    documents: [
      {
        id: "manual-pt",
        locale: "pt-BR",
        title: "Manual de instalação F15123",
        documentType: "MANUAL",
        version: "1.2",
        fileUrl: "#"
      },
      {
        id: "manual-en",
        locale: "en",
        title: "F15123 installation manual",
        documentType: "MANUAL",
        version: "1.2",
        fileUrl: "#"
      }
    ],
    videos: [
      {
        id: "video-en",
        locale: "en",
        title: "F15123 installation overview",
        videoUrl: "#"
      }
    ]
  },
  {
    id: "product-f30098",
    partNumber: "F30098",
    family: "Transmission",
    active: true,
    translations: {
      "pt-BR": {
        name: "Rolamento de transmissão F30098",
        description: "Rolamento cônico para transmissão pesada.",
        application: "Caixas de câmbio e diferenciais",
        features: [
          "Geometria otimizada",
          "Alta capacidade de carga",
          "Baixo atrito"
        ]
      },
      es: {
        name: "Rodamiento de transmisión F30098",
        description: "Rodamiento cónico para transmisión pesada.",
        application: "Cajas de cambio y diferenciales",
        features: [
          "Geometría optimizada",
          "Alta capacidad de carga",
          "Baja fricción"
        ]
      },
      en: {
        name: "F30098 transmission bearing",
        description: "Tapered bearing for heavy-duty transmissions.",
        application: "Gearboxes and differentials",
        features: ["Optimized geometry", "High load capacity", "Low friction"]
      }
    },
    documents: [
      {
        id: "sheet-en",
        locale: "en",
        title: "F30098 technical sheet",
        documentType: "TECHNICAL_SHEET",
        version: "2.0",
        fileUrl: "#"
      }
    ],
    videos: []
  }
];

export const mockCategories: IssueCategory[] = [
  {
    id: "vibration",
    translations: {
      "pt-BR": "Vibração excessiva",
      es: "Vibración excesiva",
      en: "Excessive vibration"
    }
  },
  {
    id: "overheating",
    translations: {
      "pt-BR": "Aquecimento",
      es: "Sobrecalentamiento",
      en: "Overheating"
    }
  },
  { id: "noise", translations: { "pt-BR": "Ruído", es: "Ruido", en: "Noise" } },
  {
    id: "play",
    translations: {
      "pt-BR": "Folga excessiva",
      es: "Holgura excesiva",
      en: "Excessive play"
    }
  }
];

export const mockKnownIssues: KnownIssue[] = [
  {
    id: "issue-vibration",
    productId: "product-f15123",
    categoryId: "vibration",
    translations: {
      "pt-BR": {
        title: "Vibração excessiva",
        description: "Verificações iniciais para vibração no conjunto."
      },
      es: {
        title: "Vibración excesiva",
        description: "Comprobaciones iniciales para vibración en el conjunto."
      },
      en: {
        title: "Excessive vibration",
        description: "Initial checks for assembly vibration."
      }
    },
    steps: [
      {
        id: "step-1",
        order: 1,
        title: {
          "pt-BR": "Verifique a lubrificação",
          es: "Compruebe la lubricación",
          en: "Check lubrication"
        },
        description: {
          "pt-BR":
            "Confirme o lubrificante recomendado e a ausência de contaminação.",
          es: "Confirme el lubricante recomendado y la ausencia de contaminación.",
          en: "Confirm the recommended lubricant and absence of contamination."
        },
        requiresConfirmation: true
      },
      {
        id: "step-2",
        order: 2,
        title: {
          "pt-BR": "Confira o alinhamento",
          es: "Compruebe la alineación",
          en: "Check alignment"
        },
        description: {
          "pt-BR": "Inspecione o assentamento e o alinhamento dos componentes.",
          es: "Inspeccione el asiento y la alineación de los componentes.",
          en: "Inspect the seating and alignment of components."
        },
        requiresConfirmation: true
      },
      {
        id: "step-3",
        order: 3,
        title: {
          "pt-BR": "Verifique o torque",
          es: "Compruebe el torque",
          en: "Check torque"
        },
        description: {
          "pt-BR": "Use a ferramenta calibrada conforme a especificação.",
          es: "Utilice una herramienta calibrada según la especificación.",
          en: "Use a calibrated tool to the specified torque."
        },
        requiresConfirmation: true
      }
    ]
  }
];

export const mockTickets: Ticket[] = [
  {
    id: "ticket-132",
    number: 132,
    customerName: "Mariana Costa",
    organizationName: "Oficina Horizonte",
    role: "MECHANIC",
    country: "Brasil",
    locale: "pt-BR",
    productId: "product-f15123",
    productPartNumber: "F15123",
    issueTitle: {
      "pt-BR": "Vibração excessiva",
      es: "Vibración excesiva",
      en: "Excessive vibration"
    },
    description: "A vibração aumentou após a última manutenção.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    branchName: "Equipe regional (demo)",
    assigneeName: "Rafael Mendes",
    updatedAt: "2026-08-25T13:18:00Z",
    createdAt: "2026-08-25T12:20:00Z",
    equipment: "Caminhão de entrega",
    serialNumber: "VH-40188",
    location: "Curitiba, PR",
    messages: [
      {
        id: "message-1",
        authorName: "Rafael Mendes",
        body: "Recebemos sua solicitação. Vamos analisar as evidências enviadas.",
        visibility: "CUSTOMER",
        createdAt: "2026-08-25T13:18:00Z"
      }
    ],
    history: [
      {
        id: "history-1",
        action: "TICKET_CREATED",
        createdAt: "2026-08-25T12:20:00Z"
      },
      {
        id: "history-2",
        action: "ROUTED_TO_BRANCH",
        createdAt: "2026-08-25T12:27:00Z"
      },
      { id: "history-3", action: "ASSIGNED", createdAt: "2026-08-25T12:40:00Z" }
    ]
  },
  {
    id: "ticket-127",
    number: 127,
    customerName: "Carlos Méndez",
    organizationName: "Taller Norte",
    role: "DISTRIBUTOR",
    country: "México",
    locale: "es",
    productId: "product-f30098",
    productPartNumber: "F30098",
    issueTitle: {
      "pt-BR": "Aquecimento",
      es: "Sobrecalentamiento",
      en: "Overheating"
    },
    description: "El componente se calienta durante la operación.",
    status: "WAITING_CUSTOMER",
    priority: "MEDIUM",
    branchName: "Equipe regional (demo)",
    assigneeName: "Lucía Torres",
    updatedAt: "2026-08-24T16:00:00Z",
    createdAt: "2026-08-23T11:00:00Z",
    equipment: "Transmisión",
    location: "Monterrey",
    messages: [],
    history: [
      {
        id: "history-4",
        action: "TICKET_CREATED",
        createdAt: "2026-08-23T11:00:00Z"
      }
    ]
  },
  {
    id: "ticket-121",
    number: 121,
    customerName: "Taylor Reed",
    organizationName: "Northline Service",
    role: "DISTRIBUTOR",
    country: "United States",
    locale: "en",
    productId: "product-f15123",
    productPartNumber: "F15123",
    issueTitle: { "pt-BR": "Ruído", es: "Ruido", en: "Noise" },
    description: "Noise during the first minutes of operation.",
    status: "RESOLVED",
    priority: "LOW",
    branchName: "Equipe regional (demo)",
    updatedAt: "2026-08-22T16:00:00Z",
    createdAt: "2026-08-20T11:00:00Z",
    messages: [],
    history: [
      {
        id: "history-5",
        action: "TICKET_CREATED",
        createdAt: "2026-08-20T11:00:00Z"
      }
    ]
  }
];

export const mockDashboardMetrics: DashboardMetrics = {
  newTickets: 12,
  inProgress: 28,
  waitingCustomer: 9,
  waitingTechnician: 4,
  resolvedToday: 7,
  resolvedMonth: 143,
  averageResponseHours: 3.4,
  selfServiceRate: 41,
  languages: [
    { locale: "pt-BR", percentage: 58 },
    { locale: "es", percentage: 27 },
    { locale: "en", percentage: 15 }
  ]
};
