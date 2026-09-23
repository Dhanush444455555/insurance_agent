/**
 * API service for communicating with the backend risk evaluation service.
 * Endpoint: POST /api/analyze-risk
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Pre-loaded synthetic customer database.
 * Enables instant lookups by Customer ID for demonstration.
 */
export const SYNTHETIC_CUSTOMERS = {
  'CUST-1001': {
    customerId: 'CUST-1001',
    name: 'Sarah Jenkins',
    age: 24,
    income: 42000,
    claimsCount: 3,
    totalClaimAmount: 18500,
    locationRisk: 'High',
    vehicleRisk: 'High',
    requiredCoverage: 'Comprehensive',
    tier: 'High Risk Exposure',
  },
  'CUST-1002': {
    customerId: 'CUST-1002',
    name: 'Marcus Vance',
    age: 46,
    income: 135000,
    claimsCount: 0,
    totalClaimAmount: 0,
    locationRisk: 'Low',
    vehicleRisk: 'Low',
    requiredCoverage: 'Standard',
    tier: 'Preferred Low Risk',
  },
  'CUST-1003': {
    customerId: 'CUST-1003',
    name: 'Elena Rostova',
    age: 36,
    income: 88000,
    claimsCount: 1,
    totalClaimAmount: 4200,
    locationRisk: 'Medium',
    vehicleRisk: 'Medium',
    requiredCoverage: 'Comprehensive',
    tier: 'Moderate Risk',
  },
  'CUST-1004': {
    customerId: 'CUST-1004',
    name: 'David Kim',
    age: 22,
    income: 38000,
    claimsCount: 2,
    totalClaimAmount: 9400,
    locationRisk: 'High',
    vehicleRisk: 'Medium',
    requiredCoverage: 'Basic',
    tier: 'Young Driver Elevated Risk',
  },
  'CUST-1005': {
    customerId: 'CUST-1005',
    name: 'Amanda Bailey',
    age: 52,
    income: 165000,
    claimsCount: 0,
    totalClaimAmount: 0,
    locationRisk: 'Low',
    vehicleRisk: 'Low',
    requiredCoverage: 'Premium',
    tier: 'Executive Low Risk',
  },
};

/**
 * Retrieves a customer profile by ID.
 * If not in pre-loaded database, generates a deterministic synthetic profile from the ID string.
 */
export function getCustomerById(customerId) {
  const cleanId = (customerId || '').trim().toUpperCase();
  if (SYNTHETIC_CUSTOMERS[cleanId]) {
    return { ...SYNTHETIC_CUSTOMERS[cleanId] };
  }

  // Hash-based deterministic generator for arbitrary customer IDs entered by user
  let hash = 0;
  for (let i = 0; i < cleanId.length; i++) {
    hash = (hash << 5) - hash + cleanId.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const ages = [23, 29, 34, 42, 51, 63];
  const incomes = [35000, 52000, 78000, 95000, 125000, 160000];
  const claimCounts = [0, 1, 2, 3];
  const locations = ['Low', 'Medium', 'High'];
  const vehicles = ['Low', 'Medium', 'High'];
  const coverages = ['Basic', 'Standard', 'Comprehensive', 'Premium'];

  const claimsCount = claimCounts[absHash % claimCounts.length];
  const totalClaimAmount = claimsCount === 0 ? 0 : Math.round(((absHash % 18) + 2) * 1250);

  return {
    customerId: cleanId || 'CUST-1001',
    name: `Policyholder ${cleanId.replace(/[^0-9]/g, '') || '901'}`,
    age: ages[absHash % ages.length],
    income: incomes[absHash % incomes.length],
    claimsCount,
    totalClaimAmount,
    locationRisk: locations[absHash % locations.length],
    vehicleRisk: vehicles[absHash % vehicles.length],
    requiredCoverage: coverages[absHash % coverages.length],
    tier: claimsCount >= 2 ? 'High Risk' : claimsCount === 1 ? 'Moderate Risk' : 'Low Risk',
  };
}

/**
 * Normalizes backend response or calculates fallback simulation adhering to the agreed API contract.
 */
function generateDynamicAssessment(customerData) {
  const age = Number(customerData.age) || 30;
  const income = Number(customerData.income) || 50000;
  const claimsCount = Number(customerData.claimsCount) || 0;
  const totalClaimAmount = Number(customerData.totalClaimAmount) || 0;
  const locRisk = (customerData.locationRisk || 'Medium').toLowerCase();
  const vehRisk = (customerData.vehicleRisk || 'Medium').toLowerCase();

  // Dynamic risk calculation adhering to agreed risk engine criteria
  let baseScore = 20;

  // Claim frequency & amount impact
  if (claimsCount >= 3) baseScore += 35;
  else if (claimsCount >= 1) baseScore += claimsCount * 12;

  if (totalClaimAmount > 25000) baseScore += 25;
  else if (totalClaimAmount > 10000) baseScore += 15;
  else if (totalClaimAmount > 3000) baseScore += 8;

  // Location risk factor
  if (locRisk === 'high') baseScore += 18;
  else if (locRisk === 'medium') baseScore += 8;

  // Vehicle risk factor
  if (vehRisk === 'high') baseScore += 15;
  else if (vehRisk === 'medium') baseScore += 6;

  // Age factor
  if (age < 25) baseScore += 12;
  else if (age > 65) baseScore += 8;

  // Income stability buffer
  if (income > 120000) baseScore -= 10;
  else if (income < 30000) baseScore += 8;

  const riskScore = Math.min(Math.max(Math.round(baseScore), 12), 96);

  let riskLevel = 'LOW';
  if (riskScore >= 70) riskLevel = 'HIGH';
  else if (riskScore >= 40) riskLevel = 'MEDIUM';

  // Construct realistic risk factors
  const riskFactors = [];
  if (claimsCount >= 2) riskFactors.push('High claim frequency detected over policy history');
  else if (claimsCount === 1) riskFactors.push('Recent single claim on file');

  if (totalClaimAmount >= 10000) riskFactors.push(`Elevated cumulative loss ratio ($${totalClaimAmount.toLocaleString()})`);
  if (locRisk === 'high') riskFactors.push('High-risk territorial loss zone / natural disaster quadrant');
  if (vehRisk === 'high') riskFactors.push('High-performance or elevated theft-index vehicle class');
  if (age < 25) riskFactors.push('Young driver risk exposure bracket (<25 years)');
  if (riskFactors.length === 0) {
    riskFactors.push('Clean underwriting record with no adverse claims history');
    riskFactors.push('Standard low-exposure demographic profile');
  }

  // AI Summary based on calculated factors
  const summaryPrefix = riskLevel === 'HIGH'
    ? 'Customer demonstrates elevated risk based on the supplied information. Multiple exposure thresholds have been triggered including recent claims volume and high-risk environmental factors.'
    : riskLevel === 'MEDIUM'
    ? 'Customer presents a moderate underwriting risk profile with balanced exposure metrics. Recommended for standard underwriting tier subject to deductible verification.'
    : 'Customer profile demonstrates low actuarial risk with exemplary stability indicators and minimal historical loss exposure.';

  // Retrieved Guidelines from RAG
  const retrievedGuidelines = [
    {
      id: 'UW-GL-401',
      title: 'Loss Frequency & Claim Severity Thresholds',
      excerpt: 'Accounts exceeding 2 claim events within a 36-month rolling window or $10,000 aggregated payout require mandatory secondary underwriting review before comprehensive endorsement binding.',
      relevance: '94% Match (Vector distance 0.12)'
    },
    {
      id: 'UW-GL-118',
      title: 'Territorial Risk Adjustment & Zonal Ratings',
      excerpt: 'Zip codes designated as High Risk (Zone IV) necessitate a minimum 18% surcharge on collision riders and restricted glass deductible caps.',
      relevance: '89% Match (Vector distance 0.18)'
    },
    {
      id: 'UW-GL-205',
      title: 'Vehicle Performance Classification & Loss Propensity',
      excerpt: 'High-risk vehicle categories require telematics endorsement opt-in or enhanced comprehensive deductibles of not less than $1,000.',
      relevance: '83% Match (Vector distance 0.24)'
    }
  ];

  // ML predicted suitability
  // Wording rule: STRICTLY "Predicted suitability", never call one universally "best"
  let planA_score = 62;
  let planB_score = 87;
  let planC_score = 74;

  if (riskLevel === 'HIGH') {
    planA_score = 54;
    planB_score = 89;
    planC_score = 71;
  } else if (riskLevel === 'LOW') {
    planA_score = 88;
    planB_score = 65;
    planC_score = 82;
  }

  // Chart data: Dimensional Breakdown (Customer vs Industry Benchmark)
  const dimensionScores = [
    {
      dimension: 'Claims Propensity',
      score: Math.min(Math.round(claimsCount * 28 + (totalClaimAmount > 10000 ? 25 : 10)), 100),
      benchmark: 35,
    },
    {
      dimension: 'Territorial Hazard',
      score: locRisk === 'high' ? 85 : locRisk === 'medium' ? 52 : 22,
      benchmark: 45,
    },
    {
      dimension: 'Vehicle Severity',
      score: vehRisk === 'high' ? 82 : vehRisk === 'medium' ? 50 : 25,
      benchmark: 40,
    },
    {
      dimension: 'Financial Exposure',
      score: income < 40000 ? 78 : income < 80000 ? 48 : 20,
      benchmark: 38,
    },
  ];

  // Chart data: Risk Exposure Pie/Donut Distribution
  const claimWeight = Math.max(claimsCount * 15 + (totalClaimAmount > 5000 ? 20 : 5), 10);
  const locWeight = locRisk === 'high' ? 30 : locRisk === 'medium' ? 20 : 10;
  const vehWeight = vehRisk === 'high' ? 25 : vehRisk === 'medium' ? 18 : 10;
  const demoWeight = age < 25 ? 25 : age > 60 ? 20 : 12;
  const totalWeight = claimWeight + locWeight + vehWeight + demoWeight;

  const exposureDistribution = [
    { name: 'Claims Loss History', value: Math.round((claimWeight / totalWeight) * 100), color: '#f43f5e' },
    { name: 'Territorial Risk', value: Math.round((locWeight / totalWeight) * 100), color: '#06b6d4' },
    { name: 'Vehicle Risk Class', value: Math.round((vehWeight / totalWeight) * 100), color: '#818cf8' },
    { name: 'Demographic Exposure', value: Math.round((demoWeight / totalWeight) * 100), color: '#f59e0b' },
  ];

  return {
    customerId: customerData.customerId || 'CUST-1001',
    customerProfile: customerData,
    riskScore,
    riskLevel,
    riskFactors,
    aiSummary: summaryPrefix,
    retrievedGuidelines,
    dimensionScores,
    exposureDistribution,
    plans: [
      {
        id: 'plan_a',
        name: 'Plan A (Essential Shield)',
        type: 'Standard Liability & Roadside',
        predictedSuitability: planA_score,
        monthlyEstimate: `$${Math.round(85 + (riskScore * 0.9))}/mo`,
        coverageLimit: '$100,000 / $300,000',
        deductible: '$1,000',
        keyFeatures: [
          'Basic Third-Party Liability',
          '24/7 Roadside Towing Assistance',
          'Digital Claims Processing'
        ]
      },
      {
        id: 'plan_b',
        name: 'Plan B (Comprehensive Plus)',
        type: 'Full Comprehensive & Collision',
        predictedSuitability: planB_score,
        monthlyEstimate: `$${Math.round(145 + (riskScore * 1.4))}/mo`,
        coverageLimit: '$250,000 / $500,000',
        deductible: '$500',
        keyFeatures: [
          'Comprehensive Collision & Vandalism',
          'Uninsured Motorist Protection',
          'Telematics Rate Reduction Option',
          'Zero-Deductible Glass Waiver'
        ]
      },
      {
        id: 'plan_c',
        name: 'Plan C (Executive Umbrella)',
        type: 'High-Limit Asset Protection',
        predictedSuitability: planC_score,
        monthlyEstimate: `$${Math.round(210 + (riskScore * 1.8))}/mo`,
        coverageLimit: '$1,000,000 Umbrella',
        deductible: '$250',
        keyFeatures: [
          'Full Replacement Cost Guarantee',
          'Global Umbrella Liability ($1M)',
          'OEM Parts Guarantee',
          'Dedicated Concierge Underwriter'
        ]
      }
    ],
    timestamp: new Date().toISOString(),
    isMockFallback: true
  };
}

/**
 * Primary API invocation: POST /api/analyze-risk
 */
export async function analyzeRisk(customerData) {
  const payload = {
    customer_id: customerData.customerId,
    age: Number(customerData.age),
    income: Number(customerData.income),
    claims_count: Number(customerData.claimsCount),
    total_claim_amount: Number(customerData.totalClaimAmount),
    location_risk: customerData.locationRisk,
    vehicle_risk: customerData.vehicleRisk,
    required_coverage: customerData.requiredCoverage,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(`${API_BASE_URL}/api/analyze-risk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const fallbackData = generateDynamicAssessment(customerData);

      return {
        customerId: data.customer_id || data.customerId || customerData.customerId,
        customerProfile: customerData,
        riskScore: data.risk_score ?? data.riskScore ?? fallbackData.riskScore,
        riskLevel: (data.risk_level || data.riskLevel || fallbackData.riskLevel).toUpperCase(),
        riskFactors: data.risk_factors || data.riskFactors || fallbackData.riskFactors,
        aiSummary: data.ai_summary || data.aiSummary || data.summary || fallbackData.aiSummary,
        retrievedGuidelines: data.retrieved_guidelines || data.guidelines || fallbackData.retrievedGuidelines,
        dimensionScores: data.dimension_scores || data.dimensionScores || fallbackData.dimensionScores,
        exposureDistribution: data.exposure_distribution || data.exposureDistribution || fallbackData.exposureDistribution,
        plans: (data.plans || fallbackData.plans).map((p, idx) => ({
          id: p.id || `plan_${idx}`,
          name: p.name || `Plan ${String.fromCharCode(65 + idx)}`,
          type: p.type || 'Standard Policy',
          predictedSuitability: p.predicted_suitability ?? p.suitability ?? 70,
          monthlyEstimate: p.monthly_estimate || p.premium || '$120/mo',
          coverageLimit: p.coverage_limit || '$250,000',
          deductible: p.deductible || '$500',
          keyFeatures: p.key_features || p.features || []
        })),
        timestamp: data.timestamp || new Date().toISOString(),
        isLiveBackend: true
      };
    } else {
      console.warn(`Backend responded with HTTP ${response.status}. Utilizing contract fallback.`);
      return generateDynamicAssessment(customerData);
    }
  } catch (err) {
    console.info('Backend unreachable. Executing client-side risk engine fallback:', err.message);
    return generateDynamicAssessment(customerData);
  }
}
