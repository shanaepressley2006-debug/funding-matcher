/**
 * Program Database - Seed data for funding programs
 * Contains 8+ diverse USDA and state funding programs
 */

const programs = [
  {
    id: 1,
    name: "FSA Microloans for Beginning Farmers",
    agency: "USDA Farm Service Agency",
    maxAmount: "$50,000",
    type: "Loan",
    interestRate: "3.375%",
    minExperience: 0,
    maxExperience: 10,
    minAcres: 0,
    maxAcres: 300,
    states: ["SC", "NC", "GA"],
    farmerTypes: ["beginning", "young", "small"],
    purposes: ["equipment", "operating_costs", "infrastructure"],
    deadline: "Year-round",
    applicationTime: "2-3 weeks",
    reason: "Simplified loan program designed specifically for small and beginning farmers with streamlined application.",
    benefits: [
      "Simplified application - minimal paperwork",
      "Fast approval (2-3 weeks)",
      "Low interest rate: 3.375%",
      "Perfect for farmers with off-farm employment"
    ],
    url: "https://www.fsa.usda.gov/programs-and-services/farm-loan-programs/microloans/"
  },
  {
    id: 2,
    name: "FSA Direct Operating Loans",
    agency: "USDA Farm Service Agency",
    maxAmount: "$400,000",
    type: "Loan",
    interestRate: "3.375%",
    minExperience: 0,
    maxExperience: 10,
    minAcres: 0,
    maxAcres: 1000,
    states: ["SC", "NC", "GA"],
    farmerTypes: ["beginning", "young", "small"],
    purposes: ["operating_costs", "equipment", "livestock"],
    deadline: "Year-round",
    applicationTime: "30-45 days",
    reason: "Annual operating loans for seed, fertilizer, and equipment. Beginning farmers receive priority consideration.",
    benefits: [
      "Low interest rate: 3.375%",
      "Flexible repayment based on harvest",
      "Beginning farmer priority",
      "Can refinance existing debt"
    ],
    url: "https://www.fsa.usda.gov/programs-and-services/farm-loan-programs/farm-operating-loans/"
  },
  {
    id: 3,
    name: "FSA Direct Farm Ownership Loans",
    agency: "USDA Farm Service Agency",
    maxAmount: "$600,000",
    type: "Loan",
    interestRate: "4.125%",
    minExperience: 0,
    maxExperience: 10,
    minAcres: 0,
    maxAcres: 2000,
    states: ["SC", "NC", "GA"],
    farmerTypes: ["beginning", "young", "small"],
    purposes: ["land_purchase", "equipment", "infrastructure"],
    deadline: "Year-round",
    applicationTime: "30-60 days",
    reason: "Low-interest loans to purchase farmland or major equipment. Beginning farmers can access down payment assistance.",
    benefits: [
      "Low interest rate: 4.125%",
      "Up to 40-year repayment terms",
      "Down payment assistance up to $300,150",
      "Priority for beginning farmers"
    ],
    url: "https://www.fsa.usda.gov/programs-and-services/farm-loan-programs/farm-ownership-loans/"
  },
  {
    id: 4,
    name: "EQIP - Environmental Quality Incentives Program",
    agency: "USDA NRCS",
    maxAmount: "$450,000",
    type: "Cost-share Grant",
    interestRate: "N/A",
    minExperience: 0,
    maxExperience: 50,
    minAcres: 0,
    maxAcres: 5000,
    states: ["SC", "NC", "GA"],
    farmerTypes: ["beginning", "young", "small"],
    purposes: ["irrigation", "conservation", "infrastructure", "equipment"],
    deadline: "January 15, 2026",
    applicationTime: "60-90 days",
    reason: "Covers 50-75% of conservation practice costs. Beginning farmers get 75% cost-share rate plus advance payments.",
    benefits: [
      "Covers 50-75% of conservation costs",
      "Beginning farmers eligible for 75% rate",
      "Advance payments up to 50% available",
      "Technical assistance included"
    ],
    url: "https://www.nrcs.usda.gov/programs-initiatives/eqip-environmental-quality-incentives"
  },
  {
    id: 5,
    name: "Farmer Bridge Assistance Program",
    agency: "USDA Farm Service Agency",
    maxAmount: "Varies by acreage",
    type: "Direct Payment",
    interestRate: "N/A",
    minExperience: 0,
    maxExperience: 50,
    minAcres: 1,
    maxAcres: 10000,
    states: ["SC", "NC", "GA"],
    farmerTypes: ["beginning", "young", "small"],
    purposes: ["operating_costs", "disaster_recovery"],
    deadline: "April 17, 2026",
    applicationTime: "4-6 weeks",
    reason: "One-time direct payments to row crop producers. $11 billion allocated for 2026. No repayment required.",
    benefits: [
      "Direct payments - no repayment",
      "Based on planted acres",
      "Helps offset high input costs",
      "Simple online enrollment"
    ],
    url: "https://www.farmers.gov/"
  },
  {
    id: 6,
    name: "South Carolina Agriculture Innovation Grant",
    agency: "SC Department of Agriculture",
    maxAmount: "$30,000",
    type: "Grant",
    interestRate: "N/A",
    minExperience: 0,
    maxExperience: 15,
    minAcres: 0,
    maxAcres: 500,
    states: ["SC"],
    farmerTypes: ["beginning", "young", "small"],
    purposes: ["equipment", "infrastructure", "marketing"],
    deadline: "February 2, 2026",
    applicationTime: "60 days",
    reason: "State grant for SC farmers to foster innovation. Includes expert mentorship and business development support.",
    benefits: [
      "Up to $30,000 - no repayment",
      "Expert support included",
      "Business development assistance",
      "Networking opportunities"
    ],
    url: "https://scaginnovation.com/"
  },
  {
    id: 7,
    name: "Conservation Stewardship Program (CSP)",
    agency: "USDA NRCS",
    maxAmount: "$200,000 over 5 years",
    type: "Annual Payment",
    interestRate: "N/A",
    minExperience: 0,
    maxExperience: 50,
    minAcres: 10,
    maxAcres: 5000,
    states: ["SC", "NC", "GA"],
    farmerTypes: ["beginning", "young", "small"],
    purposes: ["conservation", "soil_health", "water_management"],
    deadline: "January 15, 2026",
    applicationTime: "60-90 days",
    reason: "Rewards farmers already implementing conservation practices. Five-year contracts with annual payments (minimum $4,000/year).",
    benefits: [
      "Annual payments for 5 years (minimum $4,000/year)",
      "Rewards existing conservation efforts",
      "Technical assistance included",
      "Can stack with other USDA programs"
    ],
    url: "https://www.nrcs.usda.gov/programs-initiatives/csp-conservation-stewardship-program"
  },
  {
    id: 8,
    name: "Value-Added Producer Grant",
    agency: "USDA Rural Development",
    maxAmount: "$250,000",
    type: "Grant",
    interestRate: "N/A",
    minExperience: 0,
    maxExperience: 50,
    minAcres: 0,
    maxAcres: 10000,
    states: ["SC", "NC", "GA"],
    farmerTypes: ["beginning", "young", "small"],
    purposes: ["processing", "marketing", "equipment"],
    deadline: "Check USDA website",
    applicationTime: "120-180 days",
    reason: "Helps producers enter value-added activities. Beginning farmers receive priority consideration.",
    benefits: [
      "Planning grants up to $75,000",
      "Working capital grants up to $250,000",
      "Priority for beginning farmers",
      "Helps create new revenue streams"
    ],
    url: "https://www.rd.usda.gov/programs-services/business-programs/value-added-producer-grants"
  }
];

module.exports = programs;
