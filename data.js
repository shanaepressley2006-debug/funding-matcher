// Real funding programs from USDA and South Carolina sources (2026)
// Data sources: 
// - https://www.usaspending.gov/
// - https://www.fsa.usda.gov/programs-and-services/farm-loan-programs/
// - https://www.nrcs.usda.gov/programs-initiatives/eqip-environmental-quality-incentives
// - https://agriculture.sc.gov/

const fundingPrograms = [
    {
        id: 1,
        name: "FSA Microloans for Beginning Farmers",
        agency: "USDA Farm Service Agency",
        maxAmount: "$50,000",
        type: "Loan",
        purposes: ["equipment", "operating_costs", "infrastructure"],
        eligibility: {
            maxExperience: 10,
            farmerTypes: ["young", "beginning", "small"],
            crops: ["corn", "soybeans", "cotton", "wheat", "livestock", "specialty"],
            states: ["SC", "NC", "GA", "AL", "TN", "VA", "FL"]
        },
        description: "Simplified loan program designed specifically for small and beginning farmers. Features streamlined application with less paperwork, faster approval, and flexible terms. Perfect for farmers with off-farm employment who need capital for equipment or operating expenses.",
        benefits: [
            "Simplified application process with minimal paperwork",
            "Lower documentation requirements than traditional loans",
            "Fast approval - often within 2-3 weeks",
            "Interest rates: 3.375% (as of January 2026)",
            "No minimum loan amount required",
            "Modified farm management experience requirements"
        ],
        applicationSteps: [
            "Contact your local FSA office or apply online at farmers.gov",
            "Complete simplified FSA-2001 application form",
            "Provide basic financial information (recent pay stubs if using off-farm income)",
            "Submit simple farm operating plan showing what you'll use funds for",
            "Meet with Farm Loan Officer (can be virtual)",
            "Receive decision within 2-3 weeks"
        ],
        deadline: "Year-round (applications accepted continuously)",
        url: "https://www.fsa.usda.gov/programs-and-services/farm-loan-programs/microloans/"
    },
    {
        id: 2,
        name: "FSA Direct Operating Loans",
        agency: "USDA Farm Service Agency",
        maxAmount: "$400,000",
        type: "Loan",
        purposes: ["operating_costs", "equipment", "livestock"],
        eligibility: {
            maxExperience: 10,
            farmerTypes: ["young", "beginning", "small"],
            crops: ["corn", "soybeans", "cotton", "wheat", "livestock", "specialty"],
            states: ["SC", "NC", "GA", "AL", "TN", "VA", "FL"]
        },
        description: "Annual operating loans to cover normal farm expenses like seed, fertilizer, chemicals, fuel, and equipment. Ideal for row crop farmers who need capital for planting season. Beginning farmers receive priority consideration and may qualify for targeted funds.",
        benefits: [
            "Low interest rates: 3.375% for operating loans (January 2026)",
            "Annual operating loans available",
            "Flexible repayment based on harvest schedule",
            "Can refinance existing debt",
            "Beginning farmers get priority and targeted funds",
            "Up to 7-year terms for equipment purchases"
        ],
        applicationSteps: [
            "Contact your local FSA county office to schedule appointment",
            "Complete FSA-2001 farm loan application",
            "Provide farm operating plan and budget for the crop year",
            "Submit financial statements and tax returns (last 3 years)",
            "Attend loan interview with FSA loan officer",
            "Receive decision within 30-45 days"
        ],
        deadline: "Year-round (apply before planting season for best timing)",
        url: "https://www.fsa.usda.gov/programs-and-services/farm-loan-programs/farm-operating-loans/"
    },
    {
        id: 3,
        name: "FSA Direct Farm Ownership Loans",
        agency: "USDA Farm Service Agency",
        maxAmount: "$600,000",
        type: "Loan",
        purposes: ["land_purchase", "equipment", "infrastructure"],
        eligibility: {
            maxExperience: 10,
            farmerTypes: ["young", "beginning", "small"],
            crops: ["corn", "soybeans", "cotton", "wheat", "livestock", "specialty"],
            states: ["SC", "NC", "GA", "AL", "TN", "VA", "FL"]
        },
        description: "Low-interest loans to help farmers purchase farmland, expand operations, or buy major equipment. Beginning farmers can access special down payment assistance up to $300,150. Excellent for farmers looking to transition from leasing to ownership.",
        benefits: [
            "Low interest rates: 4.125% for farm ownership (January 2026)",
            "Up to 40-year repayment terms",
            "Beginning Farmer Down Payment assistance up to $300,150",
            "Can be used for land, buildings, equipment, or infrastructure",
            "No appraisal needed for Microloans under $50,000",
            "Priority for beginning and socially disadvantaged farmers"
        ],
        applicationSteps: [
            "Contact your local FSA office to discuss your plans",
            "Complete farm loan application (Form 2301)",
            "Gather financial statements and last 3 years tax returns",
            "Submit farm operating plan showing projected income",
            "Provide details on property or equipment to be purchased",
            "Attend loan interview with FSA loan officer",
            "Wait 30-60 days for approval decision"
        ],
        deadline: "Year-round",
        url: "https://www.fsa.usda.gov/programs-and-services/farm-loan-programs/farm-ownership-loans/"
    },
    {
        id: 4,
        name: "EQIP - Environmental Quality Incentives Program",
        agency: "USDA Natural Resources Conservation Service (NRCS)",
        maxAmount: "$450,000",
        type: "Cost-share Grant",
        purposes: ["irrigation", "conservation", "infrastructure", "equipment"],
        eligibility: {
            farmerTypes: ["young", "beginning", "small"],
            crops: ["corn", "soybeans", "cotton", "wheat", "livestock", "specialty"],
            states: ["SC", "NC", "GA", "AL", "TN", "VA", "FL"]
        },
        description: "Provides financial assistance for implementing conservation practices on agricultural land. Covers irrigation systems, soil health improvements, water management, and conservation equipment. Beginning farmers receive priority ranking and can get up to 75% cost-share plus advance payments.",
        benefits: [
            "Covers 50-75% of conservation practice costs",
            "Beginning farmers eligible for 75% cost-share rate",
            "Advance payments up to 50% available for beginning farmers",
            "Technical assistance and design help included at no cost",
            "Can combine with other USDA programs",
            "Priority for beginning, socially disadvantaged, and veteran farmers"
        ],
        applicationSteps: [
            "Contact your local NRCS office or apply online at farmers.gov",
            "Schedule farm visit for resource assessment",
            "Work with NRCS conservationist to develop conservation plan",
            "Submit application by January 15, 2026 for FY2026 funding",
            "Wait for ranking and selection (60-90 days after deadline)",
            "Sign contract and begin implementation with technical support"
        ],
        deadline: "January 15, 2026 (national batching deadline for FY2026)",
        url: "https://www.nrcs.usda.gov/programs-initiatives/eqip-environmental-quality-incentives"
    },
    {
        id: 5,
        name: "Farmer Bridge Assistance Program",
        agency: "USDA Farm Service Agency",
        maxAmount: "Varies by crop and acreage",
        type: "Direct Payment",
        purposes: ["operating_costs", "disaster_recovery"],
        eligibility: {
            farmerTypes: ["young", "beginning", "small"],
            crops: ["corn", "soybeans", "cotton", "wheat"],
            states: ["SC", "NC", "GA", "AL", "TN", "VA", "FL"]
        },
        description: "One-time direct payments to row crop producers facing market disruptions and elevated input costs. $11 billion allocated for 2026. Payments based on acres planted to eligible crops. Enrollment period: February 23 - April 17, 2026.",
        benefits: [
            "Direct payments - no repayment required",
            "Based on your planted acres of eligible crops",
            "Helps offset high input costs (seed, fertilizer, chemicals)",
            "Simple enrollment process through farmers.gov",
            "Payments issued within weeks of enrollment",
            "Available to all eligible producers regardless of size"
        ],
        applicationSteps: [
            "Create or update your farmers.gov account",
            "Verify your farm records and acreage are current with FSA",
            "Enroll online at farmers.gov between Feb 23 - April 17, 2026",
            "Certify your planted acres for eligible crops",
            "Review and sign enrollment forms electronically",
            "Receive payment within 4-6 weeks after enrollment"
        ],
        deadline: "April 17, 2026 (enrollment closes)",
        url: "https://www.fsa.usda.gov/news-events/news/12-31-2025/usda-announces-commodity-payment-rates-farmer-bridge-assistance-program"
    },
    {
        id: 6,
        name: "South Carolina Agriculture Innovation Grant",
        agency: "SC Department of Agriculture",
        maxAmount: "$30,000",
        type: "Grant",
        purposes: ["equipment", "infrastructure", "marketing"],
        eligibility: {
            farmerTypes: ["young", "beginning", "small"],
            crops: ["corn", "soybeans", "cotton", "wheat", "specialty", "livestock"],
            states: ["SC"]
        },
        description: "State grant program to foster innovation in South Carolina agribusiness. Supports projects that enhance farm viability, create new markets, add value through processing, or optimize farm resources. Includes expert mentorship and business development support.",
        benefits: [
            "Up to $30,000 grant - no repayment required",
            "Expert support and mentorship included",
            "Business development assistance",
            "Networking opportunities with other grant recipients",
            "Can be used for equipment, infrastructure, or marketing",
            "Priority for innovative and value-added projects"
        ],
        applicationSteps: [
            "Attend informational webinar (check scaginnovation.com for dates)",
            "Develop your innovation project proposal",
            "Complete online application at scaginnovation.com",
            "Submit project budget and timeline",
            "Participate in selection interview if shortlisted",
            "Receive decision within 60 days of application deadline"
        ],
        deadline: "February 2, 2026",
        url: "https://scaginnovation.com/"
    },
    {
        id: 7,
        name: "USDA Beginning Farmer and Rancher Development Program",
        agency: "USDA National Institute of Food and Agriculture",
        maxAmount: "$250,000",
        type: "Grant",
        purposes: ["training", "education", "technical_assistance"],
        eligibility: {
            maxExperience: 10,
            farmerTypes: ["beginning", "young", "small"],
            crops: ["corn", "soybeans", "cotton", "wheat", "livestock", "specialty"],
            states: ["SC", "NC", "GA", "AL", "TN", "VA", "FL"]
        },
        description: "Provides funding for education, training, and technical assistance to beginning farmers and ranchers. Supports programs that help new farmers develop skills in production, marketing, business planning, and financial management. Often delivered through local organizations and extension services.",
        benefits: [
            "Free training and education programs",
            "Business planning assistance",
            "Mentorship and peer learning opportunities",
            "Technical assistance in production and marketing",
            "Financial management training",
            "Access to experienced farmer mentors"
        ],
        applicationSteps: [
            "Search for BFRDP-funded programs in your area",
            "Contact your local Cooperative Extension office",
            "Enroll in available training programs",
            "Participate in workshops and mentorship sessions",
            "Complete business planning modules",
            "Access ongoing support and resources"
        ],
        deadline: "Rolling basis (contact local programs for schedules)",
        url: "https://www.nifa.usda.gov/grants/programs/beginning-farmer-rancher-development-program"
    },
    {
        id: 8,
        name: "Conservation Stewardship Program (CSP)",
        agency: "USDA Natural Resources Conservation Service",
        maxAmount: "$200,000 over 5 years",
        type: "Annual Payment",
        purposes: ["conservation", "soil_health", "water_management"],
        eligibility: {
            farmerTypes: ["young", "beginning", "small"],
            crops: ["corn", "soybeans", "cotton", "wheat", "livestock", "specialty"],
            states: ["SC", "NC", "GA", "AL", "TN", "VA", "FL"]
        },
        description: "Rewards farmers who are already implementing conservation practices and want to enhance their stewardship. Five-year contracts with annual payments (minimum $4,000/year). Ideal for farmers using cover crops, reduced tillage, crop rotation, or other conservation practices.",
        benefits: [
            "Annual payments for 5 years (minimum $4,000/year)",
            "Rewards existing conservation efforts",
            "Additional payments for adopting new practices",
            "Technical assistance included",
            "Can stack with other USDA programs",
            "Helps improve soil health and farm profitability"
        ],
        applicationSteps: [
            "Contact your local NRCS office",
            "Complete conservation self-assessment",
            "Work with NRCS to document existing practices",
            "Identify opportunities for enhancement",
            "Submit application by January 15, 2026",
            "Sign 5-year contract if selected"
        ],
        deadline: "January 15, 2026 (national batching deadline)",
        url: "https://www.nrcs.usda.gov/programs-initiatives/csp-conservation-stewardship-program"
    },
    {
        id: 9,
        name: "Value-Added Producer Grant",
        agency: "USDA Rural Development",
        maxAmount: "$250,000",
        type: "Grant",
        purposes: ["processing", "marketing", "equipment"],
        eligibility: {
            farmerTypes: ["young", "beginning", "small"],
            crops: ["corn", "soybeans", "cotton", "wheat", "specialty", "livestock"],
            states: ["SC", "NC", "GA", "AL", "TN", "VA", "FL"]
        },
        description: "Helps agricultural producers enter into value-added activities related to their commodities. Supports processing, marketing, and developing new products. Beginning farmers receive priority consideration. Can fund feasibility studies, business plans, or working capital.",
        benefits: [
            "Planning grants up to $75,000 for feasibility studies",
            "Working capital grants up to $250,000",
            "Priority for beginning farmers and socially disadvantaged producers",
            "Can be used for processing equipment or marketing",
            "Helps create new revenue streams",
            "Technical assistance available"
        ],
        applicationSteps: [
            "Develop value-added product concept",
            "Create account at grants.gov",
            "Complete grant application with business plan",
            "Provide market analysis and feasibility study",
            "Submit detailed budget and timeline",
            "Wait 120-180 days for review and selection"
        ],
        deadline: "Check USDA Rural Development website for annual deadlines",
        url: "https://www.rd.usda.gov/programs-services/business-programs/value-added-producer-grants"
    },
    {
        id: 10,
        name: "Emergency Farm Loans",
        agency: "USDA Farm Service Agency",
        maxAmount: "$500,000",
        type: "Loan",
        purposes: ["disaster_recovery", "operating_costs", "equipment"],
        eligibility: {
            farmerTypes: ["young", "beginning", "small"],
            crops: ["corn", "soybeans", "cotton", "wheat", "livestock", "specialty"],
            states: ["SC", "NC", "GA", "AL", "TN", "VA", "FL"],
            requiresDisaster: true
        },
        description: "Provides emergency loans to help farmers recover from production and physical losses due to drought, flooding, hurricanes, or other natural disasters. Available only in counties declared disaster areas. Must apply within 8 months of disaster declaration.",
        benefits: [
            "Low interest rates: 3.75% (emergency loans)",
            "Up to 7-year repayment terms",
            "Can cover both physical and production losses",
            "Helps replace equipment, livestock, or structures",
            "Can refinance disaster-related debt",
            "Available for actual losses not covered by insurance"
        ],
        applicationSteps: [
            "Verify your county is declared a disaster area",
            "Contact FSA within 8 months of disaster declaration",
            "Complete emergency loan application",
            "Document losses with photos, receipts, and records",
            "Submit farm operating plan for recovery",
            "Attend loan interview",
            "Receive decision within 60 days"
        ],
        deadline: "Within 8 months of disaster declaration",
        url: "https://www.fsa.usda.gov/programs-and-services/farm-loan-programs/emergency-farm-loans/"
    }
];
