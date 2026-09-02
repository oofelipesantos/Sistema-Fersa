import type {
  DashboardMetrics,
  IssueCategory,
  KnownIssue,
  Product,
  TechnicianSummary,
  Ticket
} from "@/types/domain";

const wheelEndCatalogUrl =
  "https://www.fersa.com/uploads/files/catalogos/Fersa-WHU_EN-Wheel-end-units-CV.pdf";
const productRangeUrl =
  "https://www.fersa.com/en/product-range/wheel-end-hub-units-for-commercial-vehicles";

export const mockProducts: Product[] = [
  {
    id: "product-f400009",
    partNumber: "F400009",
    family: "Wheel End Hub Assembly",
    active: true,
    translations: {
      "pt-BR": {
        name: "Cubo de roda F 400009 com ABS",
        description:
          "Conjunto de cubo para aplicações Volvo e Renault Trucks, com rolamento F 200013.",
        application: "Eixo dianteiro, freio a disco e parafusos de 25 mm",
        features: [
          "Referências OEM 85114470, 85111791, 85111448 e 20535202",
          "Sensor ABS integrado",
          "Unidade pré-ajustada e lubrificada"
        ]
      },
      es: {
        name: "Cubo de rueda F 400009 con ABS",
        description:
          "Conjunto de cubo para aplicaciones Volvo y Renault Trucks, con rodamiento F 200013.",
        application: "Eje delantero, freno de disco y pernos de 25 mm",
        features: [
          "Referencias OEM 85114470, 85111791, 85111448 y 20535202",
          "Sensor ABS integrado",
          "Unidad preajustada y lubricada"
        ]
      },
      en: {
        name: "F 400009 wheel hub with ABS",
        description:
          "Hub assembly for Volvo and Renault Trucks applications using the F 200013 bearing.",
        application: "Front axle, disc brake and 25 mm bolts",
        features: [
          "OEM references 85114470, 85111791, 85111448 and 20535202",
          "Integrated ABS",
          "Preset and lubricated unit"
        ]
      }
    },
    documents: [
      {
        id: "catalog-f400009-en",
        locale: "en",
        title: "Fersa Wheel End Units catalogue",
        documentType: "TECHNICAL_SHEET",
        version: "2024",
        fileUrl: wheelEndCatalogUrl
      }
    ],
    videos: [
      {
        id: "wheel-end-guidance-en",
        locale: "en",
        title: "Wheel end hub installation guidance",
        videoUrl: productRangeUrl
      }
    ]
  },
  {
    id: "product-f15097",
    partNumber: "F15097",
    family: "Hub Wheel End Truck",
    active: true,
    translations: {
      "pt-BR": {
        name: "Rolamento de cubo F 15097",
        description:
          "Rolamento de cubo para veículos comerciais, utilizado em conjuntos Scania F 400015 e F 400016.",
        application: "Eixo dianteiro de caminhões Scania séries P, G, R e T",
        features: [
          "Diâmetro interno de 68 mm",
          "Diâmetro externo de 127 mm",
          "Largura de 115 mm e peso de 6,15 kg"
        ]
      },
      es: {
        name: "Rodamiento de cubo F 15097",
        description:
          "Rodamiento para vehículos comerciales usado en los conjuntos Scania F 400015 y F 400016.",
        application: "Eje delantero de camiones Scania series P, G, R y T",
        features: [
          "Diámetro interior de 68 mm",
          "Diámetro exterior de 127 mm",
          "Ancho de 115 mm y peso de 6,15 kg"
        ]
      },
      en: {
        name: "F 15097 hub bearing",
        description:
          "Commercial vehicle hub bearing used in Scania F 400015 and F 400016 assemblies.",
        application: "Scania P, G, R and T series front axle",
        features: [
          "68 mm bore diameter",
          "127 mm outside diameter",
          "115 mm width and 6.15 kg weight"
        ]
      }
    },
    documents: [
      {
        id: "catalog-f15097-en",
        locale: "en",
        title: "Fersa Wheel End Units catalogue",
        documentType: "TECHNICAL_SHEET",
        version: "2024",
        fileUrl: wheelEndCatalogUrl
      }
    ],
    videos: []
  },
  {
    id: "product-f15120",
    partNumber: "F15120",
    family: "Hub Wheel End Truck",
    active: true,
    translations: {
      "pt-BR": {
        name: "Rolamento de cubo F 15120",
        description:
          "Rolamento de cubo utilizado no conjunto F 400011 para aplicações Mercedes-Benz.",
        application: "Eixo dianteiro, freio a disco e conjunto com ABS",
        features: [
          "Peso de 2,835 kg",
          "Aplicação em veículos comerciais",
          "Integração com o conjunto F 400011"
        ]
      },
      es: {
        name: "Rodamiento de cubo F 15120",
        description:
          "Rodamiento de cubo utilizado en el conjunto F 400011 para aplicaciones Mercedes-Benz.",
        application: "Eje delantero, freno de disco y conjunto con ABS",
        features: [
          "Peso de 2,835 kg",
          "Aplicación en vehículos comerciales",
          "Integración con el conjunto F 400011"
        ]
      },
      en: {
        name: "F 15120 hub bearing",
        description:
          "Hub bearing used in the F 400011 assembly for Mercedes-Benz applications.",
        application: "Front axle, disc brake and ABS assembly",
        features: [
          "2.835 kg weight",
          "Commercial vehicle application",
          "Used with F 400011 assembly"
        ]
      }
    },
    documents: [
      {
        id: "catalog-f15120-en",
        locale: "en",
        title: "Fersa Wheel End Units catalogue",
        documentType: "TECHNICAL_SHEET",
        version: "2024",
        fileUrl: wheelEndCatalogUrl
      }
    ],
    videos: []
  },
  {
    id: "product-f200013",
    partNumber: "F200013",
    family: "Preset Wheel Bearing",
    active: true,
    translations: {
      "pt-BR": {
        name: "Rolamento pré-ajustado F 200013",
        description:
          "Unidade de rolamento para cubos de veículos comerciais Volvo e Renault Trucks.",
        application:
          "Conjuntos de eixo dianteiro F 400009, F 400013 e F 400014",
        features: [
          "68 mm × 125 mm × 115 mm",
          "Peso de 4,49 kg",
          "Pré-ajustado e lubrificado para montagem"
        ]
      },
      es: {
        name: "Rodamiento preajustado F 200013",
        description:
          "Unidad de rodamiento para cubos de vehículos Volvo y Renault Trucks.",
        application: "Conjuntos de eje delantero F 400009, F 400013 y F 400014",
        features: [
          "68 mm × 125 mm × 115 mm",
          "Peso de 4,49 kg",
          "Preajustado y lubricado para montaje"
        ]
      },
      en: {
        name: "F 200013 preset bearing",
        description:
          "Preset bearing unit for Volvo and Renault Trucks commercial vehicle hubs.",
        application: "F 400009, F 400013 and F 400014 front axle assemblies",
        features: [
          "68 mm × 125 mm × 115 mm",
          "4.49 kg weight",
          "Preset and lubricated for installation"
        ]
      }
    },
    documents: [
      {
        id: "catalog-f200013-en",
        locale: "en",
        title: "Fersa Wheel End Units catalogue",
        documentType: "MANUAL",
        version: "2024",
        fileUrl: wheelEndCatalogUrl
      }
    ],
    videos: []
  },
  {
    id: "product-f400012",
    partNumber: "F400012",
    family: "Wheel End Hub Assembly",
    active: true,
    translations: {
      "pt-BR": {
        name: "Cubo de roda F 400012",
        description:
          "Conjunto de cubo para eixos de semirreboques SAF com rolamento F 200029.",
        application: "Eixo de implemento com freio a disco",
        features: [
          "Referências OEM 3307303000 a 3307303003",
          "Rolamento F 200029",
          "Unidade completa para substituição"
        ]
      },
      es: {
        name: "Cubo de rueda F 400012",
        description:
          "Conjunto de cubo para ejes de semirremolques SAF con rodamiento F 200029.",
        application: "Eje de remolque con freno de disco",
        features: [
          "Referencias OEM 3307303000 a 3307303003",
          "Rodamiento F 200029",
          "Unidad completa para sustitución"
        ]
      },
      en: {
        name: "F 400012 wheel hub",
        description:
          "Hub assembly for SAF trailer axles using the F 200029 bearing.",
        application: "Trailer axle with disc brake",
        features: [
          "OEM references 3307303000 to 3307303003",
          "F 200029 bearing",
          "Complete replacement unit"
        ]
      }
    },
    documents: [
      {
        id: "catalog-f400012-en",
        locale: "en",
        title: "Fersa Wheel End Units catalogue",
        documentType: "TECHNICAL_SHEET",
        version: "2024",
        fileUrl: wheelEndCatalogUrl
      }
    ],
    videos: []
  }
];

export const mockTechnicians: Omit<
  TechnicianSummary,
  "activeTicketCount" | "resolvedTicketCount"
>[] = [
  {
    id: "technician-rafael",
    fullName: "Rafael Mendes",
    email: "rafael@fersa.test",
    phone: "+55 41 98888-0142",
    preferredLocale: "pt-BR",
    region: "Brasil · Cone Sul",
    specialties: ["Wheel End", "Vibração", "Análise de montagem"],
    availability: "AVAILABLE"
  },
  {
    id: "technician-sofia",
    fullName: "Sofía Álvarez",
    email: "sofia@fersa.test",
    phone: "+34 600 555 014",
    preferredLocale: "es",
    region: "Espanha · Europa",
    specialties: ["Transmissão", "Temperatura", "Visita técnica"],
    availability: "BUSY"
  },
  {
    id: "technician-daniel",
    fullName: "Daniel Brooks",
    email: "daniel@fersa.test",
    phone: "+1 567 661 0810",
    preferredLocale: "en",
    region: "América do Norte",
    specialties: ["Trailer axle", "Wheel Hub", "ABS"],
    availability: "AVAILABLE"
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
    productId: "product-f400009",
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
  },
  {
    id: "issue-temperature-f15097",
    productId: "product-f15097",
    categoryId: "overheating",
    translations: {
      "pt-BR": {
        title: "Temperatura elevada após a montagem",
        description: "Verificações de ajuste, lubrificação e assentamento."
      },
      es: {
        title: "Temperatura elevada después del montaje",
        description: "Comprobaciones de ajuste, lubricación y asiento."
      },
      en: {
        title: "High temperature after installation",
        description: "Checks for adjustment, lubrication and seating."
      }
    },
    steps: [
      {
        id: "step-temperature-1",
        order: 1,
        title: {
          "pt-BR": "Confirme a pré-carga e o torque",
          es: "Confirma la precarga y el torque",
          en: "Confirm preload and torque"
        },
        description: {
          "pt-BR":
            "Compare o procedimento aplicado com a especificação do conjunto.",
          es: "Compara el procedimiento con la especificación del conjunto.",
          en: "Compare the procedure with the assembly specification."
        },
        requiresConfirmation: true
      },
      {
        id: "step-temperature-2",
        order: 2,
        title: {
          "pt-BR": "Inspecione vedação e lubrificação",
          es: "Inspecciona el sellado y la lubricación",
          en: "Inspect sealing and lubrication"
        },
        description: {
          "pt-BR":
            "Verifique contaminação, excesso de graxa ou dano na vedação.",
          es: "Comprueba contaminación, exceso de grasa o daño en el sello.",
          en: "Check for contamination, excessive grease or seal damage."
        },
        requiresConfirmation: true
      }
    ]
  }
];

export const mockTickets: Ticket[] = [
  {
    id: "ticket-145",
    number: 145,
    customerId: "demo-user",
    organizationId: "org-horizonte",
    customerName: "Mariana Costa",
    organizationName: "Oficina Horizonte",
    role: "MECHANIC",
    country: "Brasil",
    locale: "pt-BR",
    productId: "product-f400009",
    productPartNumber: "F400009",
    issueTitle: {
      "pt-BR": "Vibração excessiva",
      es: "Vibración excesiva",
      en: "Excessive vibration"
    },
    description:
      "A vibração começou após a substituição do cubo. O veículo vibra acima de 60 km/h e a luz do ABS acende de forma intermitente.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    branchName: "Suporte América do Sul",
    assigneeName: "Lucía Torres",
    updatedAt: "2026-08-31T14:18:00Z",
    createdAt: "2026-08-31T12:20:00Z",
    equipment: "Volvo FH 460 · eixo dianteiro",
    serialNumber: "CH-9BVX2A40188",
    location: "Curitiba, PR",
    messages: [
      {
        id: "message-145-1",
        authorName: "Lucía Torres",
        body: "Recebemos a solicitação e estamos validando montagem, torque e sinal do ABS antes de decidir se é necessária uma análise em campo.",
        visibility: "CUSTOMER",
        createdAt: "2026-08-31T14:18:00Z"
      }
    ],
    history: [
      {
        id: "history-145-1",
        action: "TICKET_CREATED",
        createdAt: "2026-08-31T12:20:00Z"
      },
      {
        id: "history-145-2",
        action: "ROUTED_TO_BRANCH",
        createdAt: "2026-08-31T12:27:00Z"
      },
      {
        id: "history-145-3",
        action: "SUPPORT_ASSIGNED",
        createdAt: "2026-08-31T12:40:00Z"
      }
    ],
    attachments: [
      {
        id: "attachment-145-1",
        fileName: "video-vibracao-eixo-dianteiro.mp4",
        contentType: "video/mp4",
        sizeBytes: 4828300,
        createdAt: "2026-08-31T12:20:00Z"
      },
      {
        id: "attachment-145-2",
        fileName: "foto-cubo-f400009.jpg",
        contentType: "image/jpeg",
        sizeBytes: 428300,
        createdAt: "2026-08-31T12:20:00Z"
      }
    ]
  },
  {
    id: "ticket-144",
    number: 144,
    customerId: "customer-mx",
    organizationId: "org-taller-norte",
    customerName: "Carlos Méndez",
    organizationName: "Taller Norte",
    role: "DISTRIBUTOR",
    country: "México",
    locale: "es",
    productId: "product-f15120",
    productPartNumber: "F15120",
    issueTitle: {
      "pt-BR": "Aquecimento",
      es: "Sobrecalentamiento",
      en: "Overheating"
    },
    description:
      "La temperatura aumenta después de 20 minutos de operación. Necesitamos confirmar el torque y la condición del sello.",
    status: "WAITING_CUSTOMER",
    priority: "MEDIUM",
    branchName: "Soporte Iberia y Latam",
    assigneeName: "Lucía Torres",
    updatedAt: "2026-08-31T10:00:00Z",
    createdAt: "2026-08-30T11:00:00Z",
    equipment: "Mercedes-Benz Actros · eje delantero",
    location: "Monterrey",
    messages: [
      {
        id: "message-144-1",
        authorName: "Lucía Torres",
        body: "Por favor, envíe una foto del sello y confirme el torque aplicado durante el montaje.",
        visibility: "CUSTOMER",
        createdAt: "2026-08-31T10:00:00Z"
      }
    ],
    history: [
      {
        id: "history-144-1",
        action: "TICKET_CREATED",
        createdAt: "2026-08-30T11:00:00Z"
      },
      {
        id: "history-144-2",
        action: "CUSTOMER_INFORMATION_REQUESTED",
        createdAt: "2026-08-31T10:00:00Z"
      }
    ],
    attachments: []
  },
  {
    id: "ticket-143",
    number: 143,
    customerId: "customer-br-sul",
    organizationId: "org-sul-cargas",
    customerName: "Eduardo Nunes",
    organizationName: "Sul Cargas",
    role: "CUSTOMER",
    country: "Brasil",
    locale: "pt-BR",
    productId: "product-f200013",
    productPartNumber: "F200013",
    issueTitle: {
      "pt-BR": "Folga excessiva",
      es: "Holgura excesiva",
      en: "Excessive play"
    },
    description:
      "A folga permanece mesmo após a conferência do procedimento de montagem. O suporte recomenda avaliação especializada.",
    status: "WAITING_TECHNICIAN",
    priority: "HIGH",
    branchName: "Suporte América do Sul",
    assigneeName: "Lucía Torres",
    updatedAt: "2026-08-30T18:40:00Z",
    createdAt: "2026-08-30T14:10:00Z",
    equipment: "Volvo VM 270",
    serialNumber: "9BVM270773",
    location: "Joinville, SC",
    messages: [
      {
        id: "message-143-1",
        authorName: "Lucía Torres",
        body: "As verificações remotas foram concluídas. Estamos selecionando um técnico da especialidade Wheel End.",
        visibility: "CUSTOMER",
        createdAt: "2026-08-30T18:40:00Z"
      }
    ],
    history: [
      {
        id: "history-143-1",
        action: "TICKET_CREATED",
        createdAt: "2026-08-30T14:10:00Z"
      },
      {
        id: "history-143-2",
        action: "TECHNICIAN_REQUESTED",
        createdAt: "2026-08-30T18:40:00Z"
      }
    ],
    attachments: []
  },
  {
    id: "ticket-142",
    number: 142,
    customerId: "customer-br-oeste",
    organizationId: "org-oeste-truck",
    customerName: "João Ribeiro",
    organizationName: "Oeste Truck Center",
    role: "MECHANIC",
    country: "Brasil",
    locale: "pt-BR",
    productId: "product-f400009",
    productPartNumber: "F400009",
    issueTitle: { "pt-BR": "Ruído", es: "Ruido", en: "Noise" },
    description:
      "Ruído cíclico no eixo dianteiro após montagem. As orientações remotas não eliminaram o sintoma.",
    status: "TECHNICIAN_ASSIGNED",
    priority: "HIGH",
    branchName: "Suporte América do Sul",
    assigneeName: "Rafael Mendes",
    updatedAt: "2026-08-30T16:20:00Z",
    createdAt: "2026-08-29T09:20:00Z",
    equipment: "Renault Trucks T High",
    location: "Cascavel, PR",
    messages: [
      {
        id: "message-142-1",
        authorName: "Lucía Torres",
        body: "O caso foi encaminhado ao técnico Rafael Mendes para análise especializada.",
        visibility: "CUSTOMER",
        createdAt: "2026-08-30T16:20:00Z"
      }
    ],
    history: [
      {
        id: "history-142-1",
        action: "TICKET_CREATED",
        createdAt: "2026-08-29T09:20:00Z"
      },
      {
        id: "history-142-2",
        action: "TECHNICIAN_ASSIGNED",
        createdAt: "2026-08-30T16:20:00Z"
      }
    ],
    attachments: []
  },
  {
    id: "ticket-141",
    number: 141,
    customerId: "customer-es",
    organizationId: "org-iberica-fleet",
    customerName: "Miguel Santos",
    organizationName: "Ibérica Fleet Service",
    role: "DISTRIBUTOR",
    country: "España",
    locale: "es",
    productId: "product-f15097",
    productPartNumber: "F15097",
    issueTitle: {
      "pt-BR": "Aquecimento",
      es: "Sobrecalentamiento",
      en: "Overheating"
    },
    description:
      "La revisión remota indica que es necesario medir temperatura y juego axial en el vehículo.",
    status: "VISIT_REQUIRED",
    priority: "CRITICAL",
    branchName: "Soporte Europa",
    assigneeName: "Sofía Álvarez",
    updatedAt: "2026-08-30T09:10:00Z",
    createdAt: "2026-08-28T15:00:00Z",
    equipment: "Scania R 450",
    location: "Zaragoza, España",
    messages: [],
    history: [
      {
        id: "history-141-1",
        action: "TICKET_CREATED",
        createdAt: "2026-08-28T15:00:00Z"
      },
      {
        id: "history-141-2",
        action: "VISIT_REQUIRED",
        createdAt: "2026-08-30T09:10:00Z"
      }
    ],
    attachments: []
  },
  {
    id: "ticket-140",
    number: 140,
    customerId: "customer-us",
    organizationId: "org-northline",
    customerName: "Taylor Reed",
    organizationName: "Northline Service",
    role: "DISTRIBUTOR",
    country: "United States",
    locale: "en",
    productId: "product-f400012",
    productPartNumber: "F400012",
    issueTitle: { "pt-BR": "Ruído", es: "Ruido", en: "Noise" },
    description:
      "Intermittent noise from the SAF trailer axle. A field inspection was requested after remote checks.",
    status: "VISIT_SCHEDULED",
    priority: "MEDIUM",
    branchName: "North America Support",
    assigneeName: "Daniel Brooks",
    updatedAt: "2026-08-29T17:30:00Z",
    createdAt: "2026-08-27T11:00:00Z",
    visitScheduledAt: "2026-09-03T14:00:00Z",
    equipment: "SAF trailer axle",
    location: "Northwood, Ohio",
    messages: [
      {
        id: "message-140-1",
        authorName: "Daniel Brooks",
        body: "The field inspection is scheduled for September 3 at 10:00 AM local time.",
        visibility: "CUSTOMER",
        createdAt: "2026-08-29T17:30:00Z"
      }
    ],
    history: [
      {
        id: "history-140-1",
        action: "TICKET_CREATED",
        createdAt: "2026-08-27T11:00:00Z"
      },
      {
        id: "history-140-2",
        action: "VISIT_SCHEDULED",
        createdAt: "2026-08-29T17:30:00Z"
      }
    ],
    attachments: []
  },
  {
    id: "ticket-139",
    number: 139,
    customerId: "customer-br-minas",
    organizationId: "org-minas-diesel",
    customerName: "Ana Paula Souza",
    organizationName: "Minas Diesel",
    role: "DISTRIBUTOR",
    country: "Brasil",
    locale: "pt-BR",
    productId: "product-f200013",
    productPartNumber: "F200013",
    issueTitle: {
      "pt-BR": "Vibração excessiva",
      es: "Vibración excesiva",
      en: "Excessive vibration"
    },
    description: "Vibração após manutenção do cubo dianteiro.",
    status: "RESOLVED",
    priority: "MEDIUM",
    branchName: "Suporte América do Sul",
    assigneeName: "Rafael Mendes",
    updatedAt: "2026-08-29T16:00:00Z",
    createdAt: "2026-08-27T08:10:00Z",
    equipment: "Volvo VM 330",
    location: "Contagem, MG",
    resolutionSummary:
      "Foi corrigido o assentamento da unidade e reaplicado o torque conforme o procedimento. O teste de rodagem não apresentou vibração.",
    messages: [
      {
        id: "message-139-1",
        authorName: "Rafael Mendes",
        body: "Análise concluída. Corrigimos o assentamento e o veículo foi liberado após o teste de rodagem.",
        visibility: "CUSTOMER",
        createdAt: "2026-08-29T16:00:00Z"
      }
    ],
    history: [
      {
        id: "history-139-1",
        action: "TICKET_CREATED",
        createdAt: "2026-08-27T08:10:00Z"
      },
      {
        id: "history-139-2",
        action: "TECHNICIAN_ASSIGNED",
        createdAt: "2026-08-27T12:10:00Z"
      },
      {
        id: "history-139-3",
        action: "TICKET_RESOLVED",
        createdAt: "2026-08-29T16:00:00Z"
      }
    ],
    attachments: []
  },
  {
    id: "ticket-138",
    number: 138,
    customerId: "customer-br-norte",
    organizationId: "org-norte-implementos",
    customerName: "Paulo Andrade",
    organizationName: "Norte Implementos",
    role: "MECHANIC",
    country: "Brasil",
    locale: "pt-BR",
    productId: "product-f400012",
    productPartNumber: "F400012",
    issueTitle: { "pt-BR": "Ruído", es: "Ruido", en: "Noise" },
    description:
      "Ruído contínuo no cubo do eixo do implemento após viagem de longa distância.",
    status: "NEW",
    priority: "MEDIUM",
    branchName: "Suporte América do Sul",
    updatedAt: "2026-09-01T11:30:00Z",
    createdAt: "2026-09-01T11:30:00Z",
    equipment: "Semirreboque SAF",
    location: "Goiânia, GO",
    messages: [],
    history: [
      {
        id: "history-138-1",
        action: "TICKET_CREATED",
        createdAt: "2026-09-01T11:30:00Z"
      }
    ],
    attachments: []
  },
  {
    id: "ticket-137",
    number: 137,
    customerId: "customer-mx",
    organizationId: "org-taller-norte",
    customerName: "Carlos Méndez",
    organizationName: "Taller Norte",
    role: "DISTRIBUTOR",
    country: "México",
    locale: "es",
    productId: "product-f15120",
    productPartNumber: "F15120",
    issueTitle: { "pt-BR": "Ruído", es: "Ruido", en: "Noise" },
    description:
      "Ruido después del montaje. El cliente envió fotos y datos de torque para la revisión remota.",
    status: "RESOLVED",
    priority: "LOW",
    branchName: "Soporte Iberia y Latam",
    assigneeName: "Lucía Torres",
    updatedAt: "2026-08-28T13:00:00Z",
    createdAt: "2026-08-28T09:00:00Z",
    equipment: "Mercedes-Benz Actros",
    location: "Monterrey, México",
    resolutionSummary:
      "El soporte identificó interferencia en el protector. Se corrigió el montaje y el ruido desapareció sin necesidad de visita técnica.",
    messages: [
      {
        id: "message-137-1",
        authorName: "Lucía Torres",
        body: "La protección fue reposicionada y el síntoma quedó resuelto. Cerramos la solicitud con su confirmación.",
        visibility: "CUSTOMER",
        createdAt: "2026-08-28T13:00:00Z"
      }
    ],
    history: [
      {
        id: "history-137-1",
        action: "TICKET_CREATED",
        createdAt: "2026-08-28T09:00:00Z"
      },
      {
        id: "history-137-2",
        action: "SUPPORT_ASSIGNED",
        createdAt: "2026-08-28T09:18:00Z"
      },
      {
        id: "history-137-3",
        action: "TICKET_RESOLVED",
        createdAt: "2026-08-28T13:00:00Z"
      }
    ],
    attachments: []
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
