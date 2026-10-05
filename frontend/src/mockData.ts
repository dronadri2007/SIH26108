import {
  Sector,
  Standard,
  QueryRecord,
  StandardsGraph,
  CoverageMatrixData
} from './types';

export const CURATED_SECTORS: Sector[] = [
  {
    sector_id: 1,
    name: 'Electrical Safety',
    code: 'ETD',
    description: 'Electrotechnical installations, household appliance safety, circuit breakers, cable insulation, and earthing codes.',
    technical_committees: ['ETD 32 (Apparatus)', 'ETD 20 (Cables)', 'ETD 30 (Earthing)', 'ETD 35 (Power Electronics)'],
    total_standards: 154,
  },
  {
    sector_id: 2,
    name: 'Packaging Materials',
    code: 'PCD',
    description: 'Corrugated fibreboard containers, food-contact polymers, barrier films, hazardous material transport, and labelling.',
    technical_committees: ['PCD 12 (Packaging)', 'PCD 27 (Plastics Contact)', 'PCD 14 (Paper & Board)'],
    total_standards: 148,
  },
  {
    sector_id: 3,
    name: 'Construction & Building Materials',
    code: 'CED',
    description: 'Structural steel, Portland & Pozzolana cement grades, seismic reinforcement bars, ready-mixed concrete, and waterproofing.',
    technical_committees: ['CED 2 (Cement & Concrete)', 'CED 54 (Reinforcement)', 'CED 41 (Earthquake Engineering)'],
    total_standards: 150,
  },
];

export const CATALOG_STANDARDS: Standard[] = [
  // Electrical
  {
    standard_id: 'std-is-302-1',
    number: 'IS 302-1:2008',
    title: 'Safety of Household and Similar Electrical Appliances - General Requirements',
    technical_committee: 'ETD 32',
    sector_id: 1,
    sector_name: 'Electrical Safety',
    scope_text: 'Deals with the safety of electrical appliances for household and similar purposes, their rated voltage being not more than 250 V for single-phase and 480 V for other appliances. Covers mechanical hazards, abnormal operation, thermal safety, and moisture resistance.',
    status: 'CURRENT',
    source_url: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/IS302-1',
    curated_at: '2026-08-15T10:00:00Z',
    key_test_methods: ['Clause 11 (Heating Test)', 'Clause 13 (Leakage Current at Operating Temp)', 'Clause 19 (Abnormal Operation)'],
    mandatory_certification: true,
  },
  {
    standard_id: 'std-is-12640-1',
    number: 'IS 12640 (Part 1):2016',
    title: 'Residual Current Operated Circuit-Breakers for Household and Similar Uses (RCCBs) - Without Integral Overcurrent Protection',
    technical_committee: 'ETD 32',
    sector_id: 1,
    sector_name: 'Electrical Safety',
    scope_text: 'Applies to residual current operated circuit-breakers functionally independent of, or functionally dependent on, line voltage, for rated voltages not exceeding 440 V AC and rated currents not exceeding 125 A, intended to protect persons against indirect contact.',
    status: 'CURRENT',
    source_url: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/IS12640-1',
    curated_at: '2026-08-15T10:00:00Z',
    key_test_methods: ['Clause 9.9.2 (Tripping characteristic at residual current)', 'Clause 9.11 (Short-circuit withstand test)'],
    mandatory_certification: true,
  },
  {
    standard_id: 'std-is-3043',
    number: 'IS 3043:2018',
    title: 'Code of Practice for Earthing (First Revision)',
    technical_committee: 'ETD 30',
    sector_id: 1,
    sector_name: 'Electrical Safety',
    scope_text: 'Furnishes guidance on methods that may be adopted to earth an electrical system for the purpose of limiting the potential of current-carrying conductors respecting to the general mass of earth, and defending life and apparatus against high potentials caused by insulation faults.',
    status: 'CURRENT',
    source_url: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/IS3043',
    curated_at: '2026-08-15T10:00:00Z',
    key_test_methods: ['Soil Resistivity Measurement (Wenner 4-pin)', 'Electrode Earth Resistance Test'],
    mandatory_certification: false,
  },
  {
    standard_id: 'std-is-732',
    number: 'IS 732:2019',
    title: 'Code of Practice for Electrical Wiring Installations',
    technical_committee: 'ETD 20',
    sector_id: 1,
    sector_name: 'Electrical Safety',
    scope_text: 'Provides essential principles and guidelines for designing, selecting, erecting, inspecting, and testing of electrical wiring installations in buildings up to 1000 V AC or 1500 V DC.',
    status: 'CURRENT',
    source_url: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/IS732',
    curated_at: '2026-08-15T10:00:00Z',
    key_test_methods: ['Insulation resistance between conductors', 'Continuity of protective conductors'],
    mandatory_certification: false,
  },
  {
    standard_id: 'std-is-1885-32',
    number: 'IS 1885 (Part 32):2019',
    title: 'Electrotechnical Vocabulary - Electric Cables and Conductors',
    technical_committee: 'ETD 20',
    sector_id: 1,
    sector_name: 'Electrical Safety',
    scope_text: 'Standardizes electrotechnical terms, definitions, and classification criteria associated with insulated cables, flexible cords, bare conductors, and conductor jointing fittings.',
    status: 'CURRENT',
    source_url: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/IS1885-32',
    curated_at: '2026-08-15T10:00:00Z',
    key_test_methods: [],
    mandatory_certification: false,
  },
  {
    standard_id: 'std-is-694',
    number: 'IS 694:2010',
    title: 'Polyvinyl Chloride Insulated Unsheathed and Sheathed Cables/Cords for Working Voltages up to 1100 V',
    technical_committee: 'ETD 20',
    sector_id: 1,
    sector_name: 'Electrical Safety',
    scope_text: 'Covers requirements for single-core and multi-core PVC insulated cables with copper or aluminium conductors for electricity supply and lighting in domestic and light commercial environments.',
    status: 'CURRENT',
    source_url: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/IS694',
    curated_at: '2026-08-15T10:00:00Z',
    key_test_methods: ['Spark Test', 'Conductor Resistance Test', 'Tensile and Elongation of PVC'],
    mandatory_certification: true,
  },
  {
    standard_id: 'std-is-302-2-3',
    number: 'IS 302-2-3:2017',
    title: 'Safety of Household and Similar Electrical Appliances - Particular Requirements for Electric Irons',
    technical_committee: 'ETD 32',
    sector_id: 1,
    sector_name: 'Electrical Safety',
    scope_text: 'Deals with the safety of electric dry irons and steam irons, including those with a separate water reservoir or boiler having a capacity not exceeding 5 litres.',
    status: 'CURRENT',
    curated_at: '2026-08-15T10:00:00Z',
    key_test_methods: ['Drop test from 1m onto hardboard', 'Thermal cut-out endurance test'],
    mandatory_certification: true,
  },

  // Packaging
  {
    standard_id: 'std-is-9845',
    number: 'IS 9845:1998',
    title: 'Determination of Overall Migration of Constituents of Plastic Materials and Articles Intended to Come into Contact with Foodstuffs - Method of Analysis',
    technical_committee: 'PCD 27',
    sector_id: 2,
    sector_name: 'Packaging Materials',
    scope_text: 'Prescribes the methods of analysis for determining the overall migration limits of constituents from plastics materials, containers, and packaging articles into food simulants under controlled time and temperature regimes.',
    status: 'CURRENT',
    source_url: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/IS9845',
    curated_at: '2026-08-15T10:00:00Z',
    key_test_methods: ['Distilled Water simulant at 70°C for 2h', '3% Acetic Acid simulant', 'n-Heptane extraction at 38°C for 30min'],
    mandatory_certification: true,
  },
  {
    standard_id: 'std-is-10146',
    number: 'IS 10146:1982',
    title: 'Polyethylene for its Safe Use in Contact with Foodstuffs, Pharmaceuticals and Drinking Water',
    technical_committee: 'PCD 27',
    sector_id: 2,
    sector_name: 'Packaging Materials',
    scope_text: 'Specifies the requirements and methods of sampling and test for virgin polyethylene plastic materials (LDPE, LLDPE, HDPE) intended for manufacture of food packaging containers and closures.',
    status: 'CURRENT',
    source_url: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/IS10146',
    curated_at: '2026-08-15T10:00:00Z',
    key_test_methods: ['Extraction with n-hexane', 'Extraction with xylene', 'Heavy metals detection'],
    mandatory_certification: true,
  },
  {
    standard_id: 'std-is-2771-1',
    number: 'IS 2771 (Part 1):2003',
    title: 'Corrugated Fibreboard Boxes - Specification: Part 1 for General Packaging',
    technical_committee: 'PCD 12',
    sector_id: 2,
    sector_name: 'Packaging Materials',
    scope_text: 'Specifies requirements for material, construction, workmanship, dimensions, burst strength, and edge crush resistance of corrugated fibreboard boxes intended for general shipping and transit packaging.',
    status: 'CURRENT',
    source_url: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/IS2771-1',
    curated_at: '2026-08-15T10:00:00Z',
    key_test_methods: ['Bursting Strength Test', 'Edge Crush Test (ECT)', 'Cobb Sizing Test (IS 1060)'],
    mandatory_certification: false,
  },
  {
    standard_id: 'std-is-15380',
    number: 'IS 15380:2003',
    title: 'Moulded Plastic Containers for Packaging of Liquid Edible Oils - Specification',
    technical_committee: 'PCD 12',
    sector_id: 2,
    sector_name: 'Packaging Materials',
    scope_text: 'Prescribes the requirements and methods of test for blow moulded and injection stretch blow moulded plastic containers manufactured from PET, HDPE, and PP for packaging of refined and raw edible oils.',
    status: 'CURRENT',
    source_url: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/IS15380',
    curated_at: '2026-08-15T10:00:00Z',
    key_test_methods: ['Drop Impact Test from 1.2m at 4°C', 'Leakage & Stack Load Test'],
    mandatory_certification: true,
  },

  // Construction
  {
    standard_id: 'std-is-456',
    number: 'IS 456:2000',
    title: 'Plain and Reinforced Concrete - Code of Practice (Fourth Revision)',
    technical_committee: 'CED 2',
    sector_id: 3,
    sector_name: 'Construction & Building Materials',
    scope_text: 'Deals with the general structural use of plain and reinforced concrete. Covers design considerations, materials, mix proportions, durability provisions in aggressive chemical/marine exposure, reinforcement detailing, and inspection procedures.',
    status: 'CURRENT',
    source_url: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/IS456',
    curated_at: '2026-08-15T10:00:00Z',
    key_test_methods: ['Compressive strength of concrete cubes (IS 516)', 'Slump Cone Workability Test'],
    mandatory_certification: false,
  },
  {
    standard_id: 'std-is-1786',
    number: 'IS 1786:2008',
    title: 'High Strength Deformed Steel Bars and Wires for Concrete Reinforcement - Specification (Fourth Revision)',
    technical_committee: 'CED 54',
    sector_id: 3,
    sector_name: 'Construction & Building Materials',
    scope_text: 'Covers the requirements of deformed steel bars and wires for use as reinforcement in concrete in strength grades Fe 415, Fe 415D, Fe 500, Fe 500D, Fe 550, Fe 550D, and Fe 600. Specifies bend, rebend, chemical composition limits, and seismic ductility ratios.',
    status: 'CURRENT',
    source_url: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/IS1786',
    curated_at: '2026-08-15T10:00:00Z',
    key_test_methods: ['Tensile & Yield Stress Test', 'Mandrel Bend and 180° Rebend Test', 'Carbon Equivalent Chemical Spectrometry'],
    mandatory_certification: true,
  },
  {
    standard_id: 'std-is-1489-1',
    number: 'IS 1489 (Part 1):2015',
    title: 'Portland Pozzolana Cement - Specification: Part 1 Fly Ash Based (Third Revision)',
    technical_committee: 'CED 2',
    sector_id: 3,
    sector_name: 'Construction & Building Materials',
    scope_text: 'Covers the manufacture, chemical requirements, physical requirements, and testing of fly ash based Portland pozzolana cement produced by intimate grinding of Portland clinker, gypsum, and pozzolana.',
    status: 'CURRENT',
    source_url: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/IS1489-1',
    curated_at: '2026-08-15T10:00:00Z',
    key_test_methods: ['Fineness by Blaine Air Permeability (IS 4031-2)', 'Soundness by Le-Chatelier & Autoclave (IS 4031-3)'],
    mandatory_certification: true,
  },
  {
    standard_id: 'std-is-383',
    number: 'IS 383:2016',
    title: 'Coarse and Fine Aggregate for Concrete - Specification (Third Revision)',
    technical_committee: 'CED 2',
    sector_id: 3,
    sector_name: 'Construction & Building Materials',
    scope_text: 'Covers the requirements for aggregates derived from natural sources, slag, and recycled concrete aggregates for use in production of concrete for structural and non-structural uses.',
    status: 'CURRENT',
    source_url: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/IS383',
    curated_at: '2026-08-15T10:00:00Z',
    key_test_methods: ['Sieve analysis for grading zones', 'Aggregate Crushing Value (IS 2386-4)', 'Flakiness and Elongation Index'],
    mandatory_certification: false,
  },
];

// Added after the curated list so existing CATALOG_STANDARDS[n] indices stay valid.
// Number, title, committee and status verified on the BIS standards portal (isdetails page); scope_text and key_test_methods are paraphrased.
const STD_IS_61439_2: Standard = {
  standard_id: 'std-is-61439-2',
  number: 'IS/IEC 61439-2:2020',
  title: 'Low-Voltage Switchgear and Controlgear Assemblies - Part 2: Power Switchgear and Controlgear Assemblies (First Revision)',
  technical_committee: 'ETD 07',
  sector_id: 1,
  sector_name: 'Electrical Safety',
  scope_text: 'Covers low-voltage power switchgear and controlgear assemblies rated up to 1000 V AC or 1500 V DC. Specifies construction requirements and the design verification of temperature rise, short-circuit withstand strength, dielectric properties and enclosure degree of protection.',
  status: 'CURRENT',
  source_url: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/Indian_standards/isdetails/Mjk1MTk=',
  curated_at: '2026-10-04T00:00:00Z',
  key_test_methods: ['Temperature-rise verification', 'Short-circuit withstand verification', 'Dielectric properties verification', 'Degree of protection (IP) verification'],
};
CATALOG_STANDARDS.push(STD_IS_61439_2);

// Presets for instant evaluation & demonstration
export const PRESET_QUERIES: Record<string, QueryRecord> = {
  case1: {
    query_id: 'q-elec-substation-2026-01',
    input_type: 'DOCUMENT',
    source_filename: 'NIT_CPWD_NZ_2026_EL8942_Switchgear_Earthing.pdf',
    submitted_at: '2026-09-27T01:30:00Z',
    status: 'DONE',
    raw_text: `GOVERNMENT OF INDIA - CENTRAL PUBLIC WORKS DEPARTMENT (CPWD)
NOTICE INVITING TENDER NO: MOP/CPWD/NZ-2026/EL-8942
Item: Supply, Installation, Testing & Commissioning of 415V Low-Voltage Main Switchgear Panels, 30mA Residual Current Safety Disconnects, and Deep-Bore Chemical Pipe Earthing System.
1. The low voltage distribution cubicle shall be fabricated from 2.0mm thick CRCA sheet steel, fully compartmented, dust and vermin proof.
2. Residual current protection shall operate within 30ms at 30mA leakage to ensure personnel protection against indirect contact.
3. Earthing arrangement must attain a total earth loop resistance below 1.0 Ohm under peak dry summer soil conditions with copper bonded electrodes.
4. The main distribution assemblies shall be factory-built, type-tested low-voltage power switchgear and controlgear assemblies for 415V, 3-phase, 50Hz supply with a rated short-circuit withstand strength of 50kA.
5. All electrical wiring shall be executed with fire-retardant low smoke copper cables, with clear phase separation and continuous protective earth busbars.
6. The contractor shall furnish factory test certificates for power-frequency dielectric withstand and temperature rise not exceeding 45°C over 40°C ambient.`,
    profile: {
      profile_id: 'prof-elec-8942',
      query_id: 'q-elec-substation-2026-01',
      product: '415V Low-Voltage Switchgear Distribution Board & Earthing System',
      category: 'Electrotechnical Distribution & Safety Equipment',
      material: 'CRCA 2.0mm steel sheet enclosure, high-conductivity electrolytic copper conductors, copper-bonded ground electrodes',
      intended_use: 'Substation LV auxiliary distribution, human personnel shock protection, and institutional electrical safety',
      technical_requirements: [
        'Compartmented switchgear enclosure dust & vermin protection',
        'Residual current device tripping at 30mA within 30ms',
        'Earth pit loop resistance not exceeding 1.0 Ohm',
        'Dielectric withstand and 45°C temperature rise threshold'
      ],
      safety_requirements: [
        'Type-tested LV assembly with verified short-circuit withstand and temperature rise',
        'Indirect contact protection via RCCBs',
        'FRLS fire retardant low smoke insulation with protective earth continuity'
      ],
      quantity: '4 Main Switchgear Assemblies, 12 Earthing Pits, 24 RCCB Feeders',
      tender_reference: 'MOP/CPWD/NZ-2026/EL-8942',
      department: 'Central Public Works Department (Ministry of Housing and Urban Affairs)'
    },
    requirements: [
      {
        requirement_id: 'req-1',
        query_id: 'q-elec-substation-2026-01',
        requirement_type: 'PRODUCT',
        requirement_text: 'Type-tested low-voltage power switchgear and controlgear assembly (415V, 3-phase) with 50kA short-circuit withstand',
        source_span: 'The main distribution assemblies shall be factory-built, type-tested low-voltage power switchgear and controlgear assemblies for 415V, 3-phase, 50Hz supply with a rated short-circuit withstand strength of 50kA.'
      },
      {
        requirement_id: 'req-2',
        query_id: 'q-elec-substation-2026-01',
        requirement_type: 'SAFETY',
        requirement_text: 'Residual current trip sensitivity for personnel indirect contact protection (30mA / 30ms)',
        source_span: 'Residual current protection shall operate within 30ms at 30mA leakage to ensure personnel protection against indirect contact.'
      },
      {
        requirement_id: 'req-3',
        query_id: 'q-elec-substation-2026-01',
        requirement_type: 'TESTING',
        requirement_text: 'Substation earthing network design, electrode bonding, and earth resistance under 1.0 Ohm',
        source_span: 'Earthing arrangement must attain a total earth loop resistance below 1.0 Ohm under peak dry summer soil conditions with copper bonded electrodes.'
      },
      {
        requirement_id: 'req-4',
        query_id: 'q-elec-substation-2026-01',
        requirement_type: 'PRODUCT',
        requirement_text: 'Code of practice for electrical wiring installation and conduit erection',
        source_span: 'All electrical wiring shall be executed with fire-retardant low smoke copper cables, with clear phase separation and continuous protective earth busbars.'
      },
      {
        requirement_id: 'req-5',
        query_id: 'q-elec-substation-2026-01',
        requirement_type: 'PERFORMANCE',
        requirement_text: 'Enclosure ingress protection (IP) rating and vermin-proof enclosure certification',
        source_span: 'The low voltage distribution cubicle shall be fabricated from 2.0mm thick CRCA sheet steel, fully compartmented, dust and vermin proof.'
      },
      {
        requirement_id: 'req-6',
        query_id: 'q-elec-substation-2026-01',
        requirement_type: 'MATERIAL',
        requirement_text: 'Low smoke halogen-free dielectric insulation standards for working voltages up to 1100V',
        source_span: 'All electrical wiring shall be executed with fire-retardant low smoke copper cables...'
      }
    ],
    recommendations: [
      {
        recommendation_id: 'rec-1',
        query_id: 'q-elec-substation-2026-01',
        standard_id: 'std-is-61439-2',
        standard: STD_IS_61439_2,
        relationship_type: 'PRIMARY',
        semantic_relevance: 95.1,
        bm25_relevance: 89.7,
        vector_relevance: 97.4,
        evidence_match_count: 5,
        evidence_match_total: 5,
        official_applicability: 'REQUIRES_OFFICER_VERIFICATION',
        justification: 'IS/IEC 61439-2 is the Indian adoption of the IEC standard for low-voltage power switchgear and controlgear assemblies. It defines design verification of temperature rise, short-circuit withstand strength, dielectric properties and enclosure protection, which is what tender clauses 1, 4 and 6 call for.',
        rank: 1,
        evidence: [
          { evidence_id: 'ev-1', criterion: 'PRODUCT_CATEGORY', criterion_label: 'Product Category', matched: true, rationale: 'Governs low-voltage power switchgear and controlgear assemblies, which is the main switchboard panel this tender procures.' },
          { evidence_id: 'ev-2', criterion: 'MATERIAL', criterion_label: 'Enclosure & Construction', matched: true, rationale: 'Requires design verification of enclosure strength and degree of protection; the sheet gauge itself stays a tender-specific choice.' },
          { evidence_id: 'ev-3', criterion: 'INTENDED_USE', criterion_label: 'Intended Use', matched: true, rationale: 'Intended for power distribution and control at up to 1000 V AC, matching substation LV main distribution.' },
          { evidence_id: 'ev-4', criterion: 'SCOPE', criterion_label: 'Scope Coverage', matched: true, rationale: 'Rated voltage scope of up to 1000 V AC covers the tender 415V, 3-phase, 50Hz supply.' },
          { evidence_id: 'ev-5', criterion: 'TEST_REQUIREMENT', criterion_label: 'Testing Protocol', matched: true, rationale: 'Defines verification of temperature rise, short-circuit withstand strength and dielectric properties, matching tender clauses 4 and 6.' }
        ]
      },
      {
        recommendation_id: 'rec-2',
        query_id: 'q-elec-substation-2026-01',
        standard_id: 'std-is-12640-1',
        standard: CATALOG_STANDARDS[1],
        relationship_type: 'SAFETY',
        semantic_relevance: 93.8,
        bm25_relevance: 94.0,
        vector_relevance: 93.6,
        evidence_match_count: 5,
        evidence_match_total: 5,
        official_applicability: 'REQUIRES_OFFICER_VERIFICATION',
        justification: 'Mandatory standard directly specifying residual current operating parameters (RCCB) for 30mA protection against indirect contact, with short-circuit current withstand rating up to 10kA.',
        rank: 2,
        evidence: [
          { evidence_id: 'ev-21', criterion: 'PRODUCT_CATEGORY', criterion_label: 'Product Category', matched: true, rationale: 'Directly governs Residual Current Circuit Breakers (RCCBs) specified in clause 2.' },
          { evidence_id: 'ev-22', criterion: 'MATERIAL', criterion_label: 'Contact & Dielectric', matched: true, rationale: 'Defines silver-alloy contact durability and flame-retardant moulding requirements.' },
          { evidence_id: 'ev-23', criterion: 'INTENDED_USE', criterion_label: 'Shock Protection', matched: true, rationale: 'Exact match: indirect contact safety and earth fault isolation.' },
          { evidence_id: 'ev-24', criterion: 'SCOPE', criterion_label: 'Voltage & Current Scope', matched: true, rationale: 'Covers up to 440V AC and currents up to 125A.' },
          { evidence_id: 'ev-25', criterion: 'TEST_REQUIREMENT', criterion_label: 'Trip Time Verification', matched: true, rationale: 'Clause 9.9 specifies tripping within 300ms at 1x IΔn and 40ms at 5x IΔn.' }
        ]
      },
      {
        recommendation_id: 'rec-3',
        query_id: 'q-elec-substation-2026-01',
        standard_id: 'std-is-3043',
        standard: CATALOG_STANDARDS[2],
        relationship_type: 'SUPPORTING',
        semantic_relevance: 92.1,
        bm25_relevance: 88.5,
        vector_relevance: 94.2,
        evidence_match_count: 5,
        evidence_match_total: 5,
        official_applicability: 'REQUIRES_OFFICER_VERIFICATION',
        justification: 'The authoritative national code of practice for sizing earth busbars, chemical pipe earth electrodes, and testing earth resistance below 1.0 Ohm.',
        rank: 3,
        evidence: [
          { evidence_id: 'ev-31', criterion: 'PRODUCT_CATEGORY', criterion_label: 'Earthing Systems', matched: true, rationale: 'Specifies sub-station ground grids, earth electrodes, and bonding conductors.' },
          { evidence_id: 'ev-32', criterion: 'MATERIAL', criterion_label: 'Conductor Materials', matched: true, rationale: 'Details electrolytic copper, GI strip, and copper-bonded steel rod specs.' },
          { evidence_id: 'ev-33', criterion: 'INTENDED_USE', criterion_label: 'Fault Current Dissipation', matched: true, rationale: 'Ensures ground potential rise limitation under dead short circuit.' },
          { evidence_id: 'ev-34', criterion: 'SCOPE', criterion_label: 'Scope Coverage', matched: true, rationale: 'Applies to industrial and commercial electrical power distribution installations.' },
          { evidence_id: 'ev-35', criterion: 'TEST_REQUIREMENT', criterion_label: 'Testing Verification', matched: true, rationale: 'Prescribes Wenner four-electrode soil resistivity and fall-of-potential test methods.' }
        ]
      },
      {
        recommendation_id: 'rec-4',
        query_id: 'q-elec-substation-2026-01',
        standard_id: 'std-is-732',
        standard: CATALOG_STANDARDS[3],
        relationship_type: 'SUPPORTING',
        semantic_relevance: 88.7,
        bm25_relevance: 86.0,
        vector_relevance: 90.4,
        evidence_match_count: 4,
        evidence_match_total: 5,
        official_applicability: 'REQUIRES_OFFICER_VERIFICATION',
        justification: 'Standard installation code for internal electrical wiring, conduit layout, voltage drop calculations, and insulation resistance verification prior to commissioning.',
        rank: 4,
        evidence: [
          { evidence_id: 'ev-41', criterion: 'PRODUCT_CATEGORY', criterion_label: 'Wiring Installation', matched: true, rationale: 'Covers physical building wiring and conduit installation methods.' },
          { evidence_id: 'ev-42', criterion: 'MATERIAL', criterion_label: 'Cable Types', matched: true, rationale: 'Addresses copper conductor sizing and PVC/XLPE insulation types.' },
          { evidence_id: 'ev-43', criterion: 'INTENDED_USE', criterion_label: 'Institutional Erection', matched: true, rationale: 'Standard installation practices for institutional switchrooms.' },
          { evidence_id: 'ev-44', criterion: 'SCOPE', criterion_label: 'Scope Coverage', matched: true, rationale: 'Applies up to 1000V AC.' },
          { evidence_id: 'ev-45', criterion: 'TEST_REQUIREMENT', criterion_label: 'Commissioning Tests', matched: false, rationale: 'Lacks specific short-circuit withstand duration testing (relies on IS/IEC 61439).' }
        ]
      },
      {
        recommendation_id: 'rec-5',
        query_id: 'q-elec-substation-2026-01',
        standard_id: 'std-is-1885-32',
        standard: CATALOG_STANDARDS[4],
        relationship_type: 'TERMINOLOGY',
        semantic_relevance: 79.5,
        bm25_relevance: 78.0,
        vector_relevance: 81.0,
        evidence_match_count: 4,
        evidence_match_total: 5,
        official_applicability: 'REQUIRES_OFFICER_VERIFICATION',
        justification: 'Normative reference standard defining legal electrotechnical terminology for cable conductors, insulation grades, and shielding terms used across the tender documents.',
        rank: 5,
        evidence: [
          { evidence_id: 'ev-51', criterion: 'PRODUCT_CATEGORY', criterion_label: 'Terminology Framework', matched: true, rationale: 'Defines conductor and cable classification vocabulary.' },
          { evidence_id: 'ev-52', criterion: 'MATERIAL', criterion_label: 'Classification', matched: true, rationale: 'Provides harmonized definitions for FRLS, XLPE, and PVC.' },
          { evidence_id: 'ev-53', criterion: 'INTENDED_USE', criterion_label: 'Tender Specifications', matched: true, rationale: 'Standardizes procurement dispute resolution language.' },
          { evidence_id: 'ev-54', criterion: 'SCOPE', criterion_label: 'Electrotechnical Scope', matched: true, rationale: 'Indian adaptation of IEC 60050 international vocabulary.' },
          { evidence_id: 'ev-55', criterion: 'TEST_REQUIREMENT', criterion_label: 'Test Method', matched: false, rationale: 'Pure terminology standard; does not define test procedures.' }
        ]
      }
    ],
    why_not: [
      {
        why_not_id: 'wn-1',
        query_id: 'q-elec-substation-2026-01',
        standard_id: 'std-is-302-1',
        standard: CATALOG_STANDARDS[0],
        shared_traits: ['Same Electrotechnical Department (ETD) family of standards', 'High lexical overlap on electrical safety, low voltage, thermal rise and enclosure'],
        differing_traits: ['Scope is appliances for household and similar purposes, not power distribution assemblies', 'Does not define type verification of switchgear short-circuit withstand strength'],
        rejection_text: 'Surfaced because the tender shares generic electrical-safety vocabulary with IS 302-1, but rejected by evidence validation: IS 302-1 is the general standard for household and similar appliances, whereas the tender procures low-voltage switchgear assemblies, which IS/IEC 61439-2 governs.',
        near_miss_score: 83.2,
        crucial_mismatch: 'Product scope is household and similar appliances, not low-voltage switchgear assemblies'
      },
      {
        why_not_id: 'wn-2',
        query_id: 'q-elec-substation-2026-01',
        standard_id: 'std-is-694',
        standard: CATALOG_STANDARDS[5],
        shared_traits: ['Covers copper conductors for working voltages up to 1100V', 'High relevance for general domestic wiring'],
        differing_traits: ['Tender explicitly demands Fire Retardant Low Smoke (FRLS) specifications and halogen acid gas generation limits', 'IS 694 standard PVC does not mandate low smoke toxicity parameters under intense electrical flashover'],
        rejection_text: 'Rejected as primary recommendation because IS 694 specifies conventional general-purpose PVC cables. For high-occupancy substation control rooms, specialized FRLS/LSZH standards (IS 1554 Part 1 / IS 7098) with smoke emission limits must be cited.',
        near_miss_score: 86.8,
        crucial_mismatch: 'Does not enforce FRLS low-smoke toxic emission thresholds required in clause 5'
      }
    ],
    risks: [
      {
        risk_id: 'risk-1',
        query_id: 'q-elec-substation-2026-01',
        requirement_id: 'req-5',
        requirement_ref: 'Req #5 (Enclosure IP Protection)',
        risk_type: 'MISSING_TEST_METHOD',
        severity: 'HIGH',
        title: 'Missing Ingress Protection (IP) Test Designation',
        description: 'Clause 1 states the cubicle shall be "dust and vermin proof", but fails to specify a quantitative IP rating (e.g. IP 54 or IP 55 as per IS/IEC 60529). Without an explicit IP rating, suppliers can provide indoor-only IP 20/30 enclosures prone to dust ingress and short circuits.',
        recommended_remedy: 'Mandate enclosure verification testing as per IS/IEC 60529 with minimum rating IP 54 for indoor plant rooms and IP 55 for semi-exposed substation bays.',
        suggested_clause: '"The switchgear enclosure shall have a verified degree of protection not less than IP 54 for indoor installation in accordance with IS/IEC 60529, certified by a NABL-accredited laboratory test report."'
      },
      {
        risk_id: 'risk-2',
        query_id: 'q-elec-substation-2026-01',
        requirement_id: 'req-3',
        requirement_ref: 'Req #3 (Substation Earthing)',
        risk_type: 'UNMEASURABLE_PERFORMANCE_REQUIREMENT',
        severity: 'MEDIUM',
        title: 'Uncalibrated Seasonal Earth Resistance Condition',
        description: 'Tender clause specifies earth resistance "below 1.0 Ohm under peak dry summer soil conditions", but provides no baseline soil resistivity report or seasonal moisture correction factor formula.',
        recommended_remedy: 'Reference IS 3043:2018 Clause 34 soil resistivity profiling and prescribe four-electrode Wenner method with moisture stabilization backfill compound (Bentonite / Marconite) certified under IEEE 80 / IS 3043.',
        suggested_clause: '"Earth resistance shall be verified using the Fall-of-Potential method in accordance with IS 3043:2018 Section 7. Earth enhancement compound shall conform to standard chemical leaching criteria."'
      },
      {
        risk_id: 'risk-3',
        query_id: 'q-elec-substation-2026-01',
        requirement_id: 'req-6',
        requirement_ref: 'Req #6 (Fire-Retardant Low Smoke Cables)',
        risk_type: 'MISSING_MATERIAL_SPEC',
        severity: 'HIGH',
        title: 'Ambiguous Fire Safety Classification for Cables',
        description: 'Tender uses colloquial term "fire-retardant low smoke copper cables" without citing specific oxygen index, temperature index, or halogen acid gas emission limits under IS 10810 tests.',
        recommended_remedy: 'Specify minimum Oxygen Index ≥ 29% as per IS 10810 (Part 58), Temperature Index ≥ 250°C, and Maximum Acid Gas Generation < 20% by weight (Part 59).',
        suggested_clause: '"Insulated cables shall conform to FRLS category as per IS 1554 / IS 7098, exhibiting Oxygen Index not less than 29 (IS 10810 Part 58) and maximum smoke density rating complying with ASTM D 2843."'
      }
    ],
    coverage_matrix: {
      query_id: 'q-elec-substation-2026-01',
      requirements: [], // populated below
      standards: [], // populated below
      cells: {},
      gap_count: 1,
      gaps: [],
      coverage_percentage: 83.3
    },
    audit_logs: [
      {
        log_id: 101,
        query_id: 'q-elec-substation-2026-01',
        stage: 'EXTRACTION',
        stage_name: 'Document Parsing & Profile Extraction',
        model: 'claude-haiku-4.5',
        payload: {
          file_parsed: 'NIT_CPWD_NZ_2026_EL8942_Switchgear_Earthing.pdf',
          pages_analyzed: 4,
          detected_category: 'Electrotechnical Equipment',
          extraction_confidence: 0.98,
          tokens_processed: 1420
        },
        duration_ms: 640,
        created_at: '2026-09-27T01:30:01.120Z',
        status: 'SUCCESS'
      },
      {
        log_id: 102,
        query_id: 'q-elec-substation-2026-01',
        stage: 'DECOMPOSITION',
        stage_name: 'Tender Requirement Decomposition',
        model: 'claude-haiku-4.5',
        payload: {
          decomposed_count: 6,
          types_found: ['SAFETY', 'TESTING', 'PRODUCT', 'PERFORMANCE', 'MATERIAL'],
          traceability_anchors_pinned: 6
        },
        duration_ms: 580,
        created_at: '2026-09-27T01:30:01.780Z',
        status: 'SUCCESS'
      },
      {
        log_id: 103,
        query_id: 'q-elec-substation-2026-01',
        stage: 'RETRIEVAL',
        stage_name: 'Hybrid Search (tsvector + pgvector)',
        model: 'all-MiniLM-L6-v2 (Local)',
        payload: {
          vector_embedding_dim: 384,
          bm25_tsvector_candidates: 32,
          pgvector_cosine_candidates: 40,
          merged_deduplicated_pool: 18,
          alpha_balance_weight: '0.50 Keyword / 0.50 Semantic'
        },
        duration_ms: 112,
        created_at: '2026-09-27T01:30:01.910Z',
        status: 'SUCCESS'
      },
      {
        log_id: 104,
        query_id: 'q-elec-substation-2026-01',
        stage: 'RERANKING',
        stage_name: 'LLM Re-Ranking',
        model: 'claude-sonnet-4.5',
        payload: {
          input_candidates: 18,
          output_surfaced: 7,
          score_threshold_cutoff: 0.70
        },
        duration_ms: 1180,
        created_at: '2026-09-27T01:30:03.110Z',
        status: 'SUCCESS'
      },
      {
        log_id: 105,
        query_id: 'q-elec-substation-2026-01',
        stage: 'EVIDENCE_VALIDATION',
        stage_name: 'Criteria Evidence Verification',
        model: 'claude-haiku-4.5',
        payload: {
          candidates_evaluated: 7,
          criteria_checked_per_candidate: 5,
          passed_candidates: 5,
          diverted_to_whynot: 2
        },
        duration_ms: 890,
        created_at: '2026-09-27T01:30:04.020Z',
        status: 'SUCCESS'
      },
      {
        log_id: 106,
        query_id: 'q-elec-substation-2026-01',
        stage: 'CLASSIFICATION',
        stage_name: 'Allied Standards Graph Traversal',
        model: 'claude-haiku-4.5',
        payload: {
          primary_standards: ['IS/IEC 61439-2:2020'],
          safety_standards: ['IS 12640 (Part 1):2016', 'IS 3043:2018'],
          supporting_standards: ['IS 732:2019'],
          terminology_standards: ['IS 1885 (Part 32):2019']
        },
        duration_ms: 310,
        created_at: '2026-09-27T01:30:04.350Z',
        status: 'SUCCESS'
      },
      {
        log_id: 107,
        query_id: 'q-elec-substation-2026-01',
        stage: 'WHY_NOT',
        stage_name: 'Near-Miss Rejection Reasoning',
        model: 'claude-sonnet-4.5',
        payload: {
          near_misses_analyzed: ['IS 302-1:2008 (Household Appliances)', 'IS 694:2010 (Standard PVC)'],
          contrastive_points_generated: 4
        },
        duration_ms: 920,
        created_at: '2026-09-27T01:30:05.300Z',
        status: 'SUCCESS'
      },
      {
        log_id: 108,
        query_id: 'q-elec-substation-2026-01',
        stage: 'RISK_DETECTION',
        stage_name: 'Tender Specification Risk Detector',
        model: 'claude-sonnet-4.5',
        payload: {
          risks_detected: 3,
          severity_summary: { HIGH: 2, MEDIUM: 1, ADVISORY: 0 },
          remedies_synthesized: 3
        },
        duration_ms: 1040,
        created_at: '2026-09-27T01:30:06.360Z',
        status: 'SUCCESS'
      },
      {
        log_id: 109,
        query_id: 'q-elec-substation-2026-01',
        stage: 'RECOMMENDATION',
        stage_name: 'Official Dossier Consolidation',
        model: 'claude-sonnet-4.5',
        payload: {
          total_ranked_recommendations: 5,
          statutory_disclaimer_attached: true,
          verification_state: 'REQUIRES_OFFICER_VERIFICATION'
        },
        duration_ms: 410,
        created_at: '2026-09-27T01:30:06.790Z',
        status: 'SUCCESS'
      }
    ]
  },

  case2: {
    query_id: 'q-pkg-rations-2026-02',
    input_type: 'TEXT',
    submitted_at: '2026-09-27T01:35:00Z',
    status: 'DONE',
    raw_text: `Ministry of Defence / DRDO-DFRL Tender for Supply of Hermetic Multilayer Flexible Retort Pouches & Corrugated Shipping Containers for Armed Forces High-Altitude Ready-to-Eat (MRE) Rations.
Requirements: Food-contact food-grade multilayer film (PET/Aluminium Foil/Cast Polypropylene), Overall migration limit compliance in food simulants (3% acetic acid, n-heptane), Oxygen transmission rate < 0.1 cc/m²/24hr at 23°C/0% RH, Drop impact resistance of filled pouches from 1.5m at -20°C, and 5-ply heavy duty corrugated master cartons with bursting strength not less than 16 kg/cm².`,
    profile: {
      profile_id: 'prof-pkg-4410',
      query_id: 'q-pkg-rations-2026-02',
      product: 'Multilayer Flexible Retort Pouches & Corrugated Shipping Cartons',
      category: 'Food Packaging & Barrier Materials',
      material: 'PET / Pure Aluminium Foil / CPP barrier laminate, Virgin Polyethylene, 5-ply Kraft Paperboard',
      intended_use: 'Long-term high-altitude military ration preservation under extreme temperature conditions (-40°C to +55°C)',
      technical_requirements: [
        'Oxygen Transmission Rate < 0.1 cc/m²/24hr',
        'Water Vapour Transmission Rate < 0.1 g/m²/24hr',
        'Bursting strength of master carton ≥ 16 kg/cm²'
      ],
      safety_requirements: [
        'Overall migration test in 3% acetic acid and n-heptane food simulants',
        'Toxic heavy metal migration free (lead, cadmium, mercury)',
        'Virgin food-grade polymer certification'
      ],
      quantity: '5,000,000 pouches and 100,000 master cartons',
      tender_reference: 'DEF/DRDO-DFRL/2026/PKG-4410',
      department: 'Defence Food Research Laboratory (DFRL - DRDO)'
    },
    requirements: [
      {
        requirement_id: 'req-pkg-1',
        query_id: 'q-pkg-rations-2026-02',
        requirement_type: 'TESTING',
        requirement_text: 'Overall migration limits of plastic food packaging materials into simulants',
        source_span: 'Overall migration limit compliance in food simulants (3% acetic acid, n-heptane)'
      },
      {
        requirement_id: 'req-pkg-2',
        query_id: 'q-pkg-rations-2026-02',
        requirement_type: 'SAFETY',
        requirement_text: 'Safe food contact virgin polyethylene specifications and non-toxic additives',
        source_span: 'Virgin Polyethylene food-contact food-grade multilayer film'
      },
      {
        requirement_id: 'req-pkg-3',
        query_id: 'q-pkg-rations-2026-02',
        requirement_type: 'PRODUCT',
        requirement_text: 'Corrugated fibreboard master shipping boxes burst strength and edge crush parameters',
        source_span: '5-ply heavy duty corrugated master cartons with bursting strength not less than 16 kg/cm²'
      },
      {
        requirement_id: 'req-pkg-4',
        query_id: 'q-pkg-rations-2026-02',
        requirement_type: 'PERFORMANCE',
        requirement_text: 'Sub-zero (-20°C) drop impact resistance and pouch puncture resistance',
        source_span: 'Drop impact resistance of filled pouches from 1.5m at -20°C'
      }
    ],
    recommendations: [
      {
        recommendation_id: 'rec-pkg-1',
        query_id: 'q-pkg-rations-2026-02',
        standard_id: 'std-is-9845',
        standard: CATALOG_STANDARDS[7],
        relationship_type: 'PRIMARY',
        semantic_relevance: 97.5,
        bm25_relevance: 95.0,
        vector_relevance: 98.2,
        evidence_match_count: 5,
        evidence_match_total: 5,
        official_applicability: 'REQUIRES_OFFICER_VERIFICATION',
        justification: 'The paramount Indian standard defining test methods for overall migration analysis in food simulants (aqueous, acidic, and fatty foodstuffs) mandatory under FSSAI regulations.',
        rank: 1,
        evidence: [
          { evidence_id: 'ev-p1', criterion: 'PRODUCT_CATEGORY', criterion_label: 'Food Contact Plastics', matched: true, rationale: 'Matches multilayer flexible retort pouch contact layer directly.' },
          { evidence_id: 'ev-p2', criterion: 'MATERIAL', criterion_label: 'Simulant Solvents', matched: true, rationale: 'Specifies 3% acetic acid and n-heptane migration testing exactly as required.' },
          { evidence_id: 'ev-p3', criterion: 'INTENDED_USE', criterion_label: 'Military Rations', matched: true, rationale: 'Standard governs preservation containers for ready-to-eat foodstuffs.' },
          { evidence_id: 'ev-p4', criterion: 'SCOPE', criterion_label: 'Overall Migration Scope', matched: true, rationale: 'Authoritative statutory method for overall migration limit (≤ 10 mg/dm²).' },
          { evidence_id: 'ev-p5', criterion: 'TEST_REQUIREMENT', criterion_label: 'Laboratory Protocol', matched: true, rationale: 'Prescribes precise exposure times and gravimetric residue measurement.' }
        ]
      },
      {
        recommendation_id: 'rec-pkg-2',
        query_id: 'q-pkg-rations-2026-02',
        standard_id: 'std-is-10146',
        standard: CATALOG_STANDARDS[8],
        relationship_type: 'SAFETY',
        semantic_relevance: 94.2,
        bm25_relevance: 91.0,
        vector_relevance: 95.8,
        evidence_match_count: 5,
        evidence_match_total: 5,
        official_applicability: 'REQUIRES_OFFICER_VERIFICATION',
        justification: 'Mandatory BIS standard establishing safe resin compositions, maximum permissible levels of catalyst residues, and plasticizers for polyethylene in contact with food.',
        rank: 2,
        evidence: [
          { evidence_id: 'ev-p21', criterion: 'PRODUCT_CATEGORY', criterion_label: 'Food Polymers', matched: true, rationale: 'Applies to virgin PE resins used in seal layers.' },
          { evidence_id: 'ev-p22', criterion: 'MATERIAL', criterion_label: 'Polyethylene Grade', matched: true, rationale: 'Positive list of permitted additives and antioxidants.' },
          { evidence_id: 'ev-p23', criterion: 'INTENDED_USE', criterion_label: 'Drinking Water & Rations', matched: true, rationale: 'Guarantees no organoleptic taint or toxic transfer.' },
          { evidence_id: 'ev-p24', criterion: 'SCOPE', criterion_label: 'Resin Purity Scope', matched: true, rationale: 'Strictly excludes recycled plastic materials.' },
          { evidence_id: 'ev-p25', criterion: 'TEST_REQUIREMENT', criterion_label: 'Extraction Verification', matched: true, rationale: 'Hexane and xylene soluble fraction test criteria.' }
        ]
      },
      {
        recommendation_id: 'rec-pkg-3',
        query_id: 'q-pkg-rations-2026-02',
        standard_id: 'std-is-2771-1',
        standard: CATALOG_STANDARDS[9],
        relationship_type: 'SUPPORTING',
        semantic_relevance: 91.8,
        bm25_relevance: 93.4,
        vector_relevance: 90.1,
        evidence_match_count: 4,
        evidence_match_total: 5,
        official_applicability: 'REQUIRES_OFFICER_VERIFICATION',
        justification: 'Specifies construction, burst strength, and edge-crush test methods for outer shipping corrugated fibreboard boxes holding individual ration pouches.',
        rank: 3,
        evidence: [
          { evidence_id: 'ev-p31', criterion: 'PRODUCT_CATEGORY', criterion_label: 'Carton Packaging', matched: true, rationale: 'Covers 5-ply corrugated master shipping cases.' },
          { evidence_id: 'ev-p32', criterion: 'MATERIAL', criterion_label: 'Kraft Paperboard', matched: true, rationale: 'Prescribes grammage and fluting medium specifications.' },
          { evidence_id: 'ev-p33', criterion: 'INTENDED_USE', criterion_label: 'Transit Protection', matched: true, rationale: 'Designed for arduous military supply line transit.' },
          { evidence_id: 'ev-p34', criterion: 'SCOPE', criterion_label: 'Box Dimensions', matched: true, rationale: 'Covers up to 50kg gross transit weight.' },
          { evidence_id: 'ev-p35', criterion: 'TEST_REQUIREMENT', criterion_label: 'Burst Factor Test', matched: false, rationale: 'Does not specify sub-zero humidity conditioning for high-altitude cold deserts.' }
        ]
      }
    ],
    why_not: [
      {
        why_not_id: 'wn-pkg-1',
        query_id: 'q-pkg-rations-2026-02',
        standard_id: 'std-is-15380',
        standard: CATALOG_STANDARDS[10],
        shared_traits: ['Regulated under PCD 12 packaging committee', 'Covers edible food liquid packaging', 'Mandates drop impact tests'],
        differing_traits: ['Restricted to rigid blow-moulded bottles (PET/HDPE) for liquid edible oils', 'Does not cover high-barrier multilayer retort foil laminates or vacuum pouches'],
        rejection_text: 'Surfaced due to packaging food oil similarity, but rejected: IS 15380 specifically governs rigid blow-moulded bottles for edible oils, which cannot meet flexible retort ration packaging.',
        near_miss_score: 81.4,
        crucial_mismatch: 'Applies to rigid oil bottles, not flexible retort pouches'
      }
    ],
    risks: [
      {
        risk_id: 'risk-pkg-1',
        query_id: 'q-pkg-rations-2026-02',
        requirement_id: 'req-pkg-4',
        requirement_ref: 'Req #4 (Sub-Zero Drop Impact)',
        risk_type: 'MISSING_TEST_METHOD',
        severity: 'HIGH',
        title: 'Missing Cold Chamber Conditioning Protocol',
        description: 'Tender mandates drop test from 1.5m at -20°C, but lacks specification of conditioning duration (e.g. 24 hours at -20°C in environmental test chamber) and impact orientation (corner vs flat face drop as per ASTM D 5276 / IS 7028).',
        recommended_remedy: 'Incorporate IS 7028 (Part 4) drop test procedure specifying pre-conditioning at -20°C ± 2°C for 24 hours with defined 10-drop cycle sequence.',
        suggested_clause: '"Pouch impact testing shall be conducted following 24-hour conditioning at -20°C in accordance with IS 7028 (Part 4), recording zero burst or pinhole failure across 10 consecutive drop samples onto smooth steel plate."'
      },
      {
        risk_id: 'risk-pkg-2',
        query_id: 'q-pkg-rations-2026-02',
        requirement_id: 'req-pkg-3',
        requirement_ref: 'Req #3 (Master Carton Moisture Resistance)',
        risk_type: 'MISSING_MATERIAL_SPEC',
        severity: 'MEDIUM',
        title: 'Missing Water Resistance (Cobb Value) Specification',
        description: 'Master carton specifies bursting strength but omits Cobb value (water absorption of outer liner) required for snow-melt moisture protection in Leh/Ladakh deployments.',
        recommended_remedy: 'Add Cobb 60 test requirement (maximum water absorption ≤ 100 g/m²) as per IS 1060 (Part 1).',
        suggested_clause: '"The outer facing paper of the corrugated box shall have a maximum Cobb 60 value of 100 g/m² tested in accordance with IS 1060 (Part 1) to resist moisture penetration under snow conditions."'
      }
    ],
    coverage_matrix: {
      query_id: 'q-pkg-rations-2026-02',
      requirements: [],
      standards: [],
      cells: {},
      gap_count: 1,
      gaps: [],
      coverage_percentage: 75.0
    },
    audit_logs: [
      {
        log_id: 201,
        query_id: 'q-pkg-rations-2026-02',
        stage: 'EXTRACTION',
        stage_name: 'Text Parsing & Profile Extraction',
        model: 'claude-haiku-4.5',
        payload: { input_length: 512, category: 'Food Packaging' },
        duration_ms: 480,
        created_at: '2026-09-27T01:35:01.000Z',
        status: 'SUCCESS'
      },
      {
        log_id: 202,
        query_id: 'q-pkg-rations-2026-02',
        stage: 'DECOMPOSITION',
        stage_name: 'Requirement Decomposition',
        model: 'claude-haiku-4.5',
        payload: { count: 4, types: ['TESTING', 'SAFETY', 'PRODUCT', 'PERFORMANCE'] },
        duration_ms: 410,
        created_at: '2026-09-27T01:35:01.420Z',
        status: 'SUCCESS'
      },
      {
        log_id: 203,
        query_id: 'q-pkg-rations-2026-02',
        stage: 'RETRIEVAL',
        stage_name: 'Hybrid Search (tsvector + pgvector)',
        model: 'all-MiniLM-L6-v2 (Local)',
        payload: { candidates: 14, hybrid_alpha: 0.5 },
        duration_ms: 98,
        created_at: '2026-09-27T01:35:01.520Z',
        status: 'SUCCESS'
      },
      {
        log_id: 204,
        query_id: 'q-pkg-rations-2026-02',
        stage: 'RERANKING',
        stage_name: 'Re-Ranking',
        model: 'claude-sonnet-4.5',
        payload: { candidates_reranked: 5 },
        duration_ms: 980,
        created_at: '2026-09-27T01:35:02.500Z',
        status: 'SUCCESS'
      },
      {
        log_id: 205,
        query_id: 'q-pkg-rations-2026-02',
        stage: 'RISK_DETECTION',
        stage_name: 'Risk Detector',
        model: 'claude-sonnet-4.5',
        payload: { risks: 2, high_severity: 1 },
        duration_ms: 840,
        created_at: '2026-09-27T01:35:03.350Z',
        status: 'SUCCESS'
      }
    ]
  },

  case3: {
    query_id: 'q-civ-marine-2026-03',
    input_type: 'TEXT',
    submitted_at: '2026-09-27T01:38:00Z',
    status: 'DONE',
    raw_text: `Jawaharlal Nehru Port Authority (JNPA) Coastal Berth Expansion Project.
Procurement of 40,000 Metric Tonnes of Marine Grade Portland Pozzolana Cement (Fly-Ash Based), High-Yield Strength Deformed Thermo-Mechanically Treated Steel Rebars (Fe 500D) for Seismic Zone IV, and Coarse Aggregate for M45 Grade Marine Saline Exposure Concrete.
All materials must resist chloride ion penetration, sulphate attack in tidal zones, and possess high elongation ductility to withstand seismic ground acceleration.`,
    profile: {
      profile_id: 'prof-civ-1029',
      query_id: 'q-civ-marine-2026-03',
      product: 'Marine Grade PPC Cement, Fe 500D TMT Steel Rebars, Concrete Aggregates',
      category: 'Heavy Infrastructure & Marine Concrete',
      material: 'Fly ash Portland pozzolana cement, Fe 500D micro-alloyed ductile rebar steel, crushed granite aggregates',
      intended_use: 'Deep-water quay berths, piles, and breakwaters subjected to aggressive tidal splash and seismic shocks',
      technical_requirements: [
        'Fly ash proportion between 15% and 35%',
        'Fe 500D yield stress ≥ 500 N/mm² with minimum 16% elongation',
        'Aggregates grading meeting 20mm and 10mm marine mix proportions'
      ],
      safety_requirements: [
        'Mandatory BIS ISI mark certification for structural reinforcement bars',
        'Durability design for "Extreme" exposure conditions as per IS 456'
      ],
      quantity: '40,000 MT Cement, 12,000 MT TMT Rebars, 60,000 MT Graded Aggregate',
      tender_reference: 'IPA/JNPT/ENG-EXP/2026/CIV-1029',
      department: 'Jawaharlal Nehru Port Authority (Ministry of Ports, Shipping and Waterways)'
    },
    requirements: [
      {
        requirement_id: 'req-civ-1',
        query_id: 'q-civ-marine-2026-03',
        requirement_type: 'PRODUCT',
        requirement_text: 'Fly-ash based Portland Pozzolana Cement physical fineness and sulphate resistance',
        source_span: 'Procurement of 40,000 Metric Tonnes of Marine Grade Portland Pozzolana Cement (Fly-Ash Based)'
      },
      {
        requirement_id: 'req-civ-2',
        query_id: 'q-civ-marine-2026-03',
        requirement_type: 'SAFETY',
        requirement_text: 'High-ductility seismic grade Fe 500D thermo-mechanically treated rebar reinforcement',
        source_span: 'High-Yield Strength Deformed Thermo-Mechanically Treated Steel Rebars (Fe 500D) for Seismic Zone IV'
      },
      {
        requirement_id: 'req-civ-3',
        query_id: 'q-civ-marine-2026-03',
        requirement_type: 'TESTING',
        requirement_text: 'Code of practice for plain and reinforced concrete in extreme marine tidal splash zones',
        source_span: 'All materials must resist chloride ion penetration, sulphate attack in tidal zones... for M45 Grade Marine Saline Exposure Concrete'
      },
      {
        requirement_id: 'req-civ-4',
        query_id: 'q-civ-marine-2026-03',
        requirement_type: 'MATERIAL',
        requirement_text: 'Coarse and fine natural aggregates grading zones, flakiness, and crushing value',
        source_span: 'Coarse Aggregate for M45 Grade Marine Saline Exposure Concrete'
      }
    ],
    recommendations: [
      {
        recommendation_id: 'rec-civ-1',
        query_id: 'q-civ-marine-2026-03',
        standard_id: 'std-is-1489-1',
        standard: CATALOG_STANDARDS[13],
        relationship_type: 'PRIMARY',
        semantic_relevance: 98.1,
        bm25_relevance: 96.5,
        vector_relevance: 99.0,
        evidence_match_count: 5,
        evidence_match_total: 5,
        official_applicability: 'REQUIRES_OFFICER_VERIFICATION',
        justification: 'Statutory Indian standard for fly-ash pozzolana cement, providing enhanced pore refinement and low heat of hydration critical for marine coastal foundations.',
        rank: 1,
        evidence: [
          { evidence_id: 'ev-c1', criterion: 'PRODUCT_CATEGORY', criterion_label: 'Cementitious Materials', matched: true, rationale: 'Exact match for fly ash pozzolana cement.' },
          { evidence_id: 'ev-c2', criterion: 'MATERIAL', criterion_label: 'Fly Ash Pozzolan', matched: true, rationale: 'Mandates 15% - 35% fly ash blending conforming to IS 3812.' },
          { evidence_id: 'ev-c3', criterion: 'INTENDED_USE', criterion_label: 'Marine Infrastructure', matched: true, rationale: 'Excellent sulphate resistance and reduced permeability.' },
          { evidence_id: 'ev-c4', criterion: 'SCOPE', criterion_label: 'Manufacturing Scope', matched: true, rationale: 'Covers physical and chemical conformity parameters.' },
          { evidence_id: 'ev-c5', criterion: 'TEST_REQUIREMENT', criterion_label: 'Compressive Strength', matched: true, rationale: '28-day strength ≥ 33 MPa with Le-Chatelier soundness ≤ 10mm.' }
        ]
      },
      {
        recommendation_id: 'rec-civ-2',
        query_id: 'q-civ-marine-2026-03',
        standard_id: 'std-is-1786',
        standard: CATALOG_STANDARDS[12],
        relationship_type: 'PRIMARY',
        semantic_relevance: 96.7,
        bm25_relevance: 94.2,
        vector_relevance: 97.4,
        evidence_match_count: 5,
        evidence_match_total: 5,
        official_applicability: 'REQUIRES_OFFICER_VERIFICATION',
        justification: 'The mandatory BIS standard for high-ductility Fe 500D reinforcement bars, strictly mandating ratio of ultimate tensile strength to yield stress (UTS/YS ≥ 1.12) required for Seismic Zone IV.',
        rank: 2,
        evidence: [
          { evidence_id: 'ev-c21', criterion: 'PRODUCT_CATEGORY', criterion_label: 'Reinforcing Steel', matched: true, rationale: 'Direct specification for Fe 500D TMT bars.' },
          { evidence_id: 'ev-c22', criterion: 'MATERIAL', criterion_label: 'Chemical Composition', matched: true, rationale: 'Limits Carbon ≤ 0.25%, Sulphur ≤ 0.040%, Phosphorus ≤ 0.040%.' },
          { evidence_id: 'ev-c23', criterion: 'INTENDED_USE', criterion_label: 'Seismic Ductility', matched: true, rationale: 'Mandates minimum 16% total elongation.' },
          { evidence_id: 'ev-c24', criterion: 'SCOPE', criterion_label: 'Bar Diameters', matched: true, rationale: 'Covers diameters from 4mm to 40mm.' },
          { evidence_id: 'ev-c25', criterion: 'TEST_REQUIREMENT', criterion_label: 'Rebend Test', matched: true, rationale: 'Requires 180° mandrel bend followed by reverse bend without microcracks.' }
        ]
      },
      {
        recommendation_id: 'rec-civ-3',
        query_id: 'q-civ-marine-2026-03',
        standard_id: 'std-is-456',
        standard: CATALOG_STANDARDS[11],
        relationship_type: 'SUPPORTING',
        semantic_relevance: 95.0,
        bm25_relevance: 91.0,
        vector_relevance: 96.2,
        evidence_match_count: 5,
        evidence_match_total: 5,
        official_applicability: 'REQUIRES_OFFICER_VERIFICATION',
        justification: 'National code of practice establishing Table 3 and Table 5 minimum cement content (360 kg/m³), maximum water-cement ratio (0.40), and minimum 50mm nominal concrete cover for Extreme marine exposure.',
        rank: 3,
        evidence: [
          { evidence_id: 'ev-c31', criterion: 'PRODUCT_CATEGORY', criterion_label: 'Structural Concrete', matched: true, rationale: 'Governs all marine structural concrete elements.' },
          { evidence_id: 'ev-c32', criterion: 'MATERIAL', criterion_label: 'Durability Mix', matched: true, rationale: 'Specifies marine mix criteria in Table 5.' },
          { evidence_id: 'ev-c33', criterion: 'INTENDED_USE', criterion_label: 'Tidal Splash Zone', matched: true, rationale: 'Defines "Extreme" environmental durability measures.' },
          { evidence_id: 'ev-c34', criterion: 'SCOPE', criterion_label: 'National Code', matched: true, rationale: 'Applicable to all reinforced concrete construction in India.' },
          { evidence_id: 'ev-c35', criterion: 'TEST_REQUIREMENT', criterion_label: 'Cube Strength', matched: true, rationale: 'Specifies characteristic compressive strength compliance criteria.' }
        ]
      },
      {
        recommendation_id: 'rec-civ-4',
        query_id: 'q-civ-marine-2026-03',
        standard_id: 'std-is-383',
        standard: CATALOG_STANDARDS[14],
        relationship_type: 'SUPPORTING',
        semantic_relevance: 89.4,
        bm25_relevance: 88.0,
        vector_relevance: 90.2,
        evidence_match_count: 4,
        evidence_match_total: 5,
        official_applicability: 'REQUIRES_OFFICER_VERIFICATION',
        justification: 'Specifies grading limits, flakiness index, elongation index, and alkali-aggregate reactivity tests for aggregates used in marine concrete.',
        rank: 4,
        evidence: [
          { evidence_id: 'ev-c41', criterion: 'PRODUCT_CATEGORY', criterion_label: 'Concrete Aggregates', matched: true, rationale: 'Covers coarse and fine crushed stone aggregates.' },
          { evidence_id: 'ev-c42', criterion: 'MATERIAL', criterion_label: 'Grading Sieve', matched: true, rationale: 'Defines grading zones for 20mm and 10mm single size aggregates.' },
          { evidence_id: 'ev-c43', criterion: 'INTENDED_USE', criterion_label: 'Workability & Packing', matched: true, rationale: 'Ensures dense aggregate packing to reduce permeability.' },
          { evidence_id: 'ev-c44', criterion: 'SCOPE', criterion_label: 'Aggregate Specs', matched: true, rationale: 'Covers natural hard rock sources.' },
          { evidence_id: 'ev-c45', criterion: 'TEST_REQUIREMENT', criterion_label: 'Crushing Value', matched: false, rationale: 'Specific rapid chloride permeability test (RCPT) requires ASTM C1202.' }
        ]
      }
    ],
    why_not: [],
    risks: [
      {
        risk_id: 'risk-civ-1',
        query_id: 'q-civ-marine-2026-03',
        requirement_id: 'req-civ-3',
        requirement_ref: 'Req #3 (Concrete Marine Durability)',
        risk_type: 'MISSING_TEST_METHOD',
        severity: 'HIGH',
        title: 'Missing Rapid Chloride Permeability Test (RCPT) Benchmark',
        description: 'Tender demands chloride ion resistance for marine piles, but fails to cite ASTM C1202 or AASHTO T277 RCPT charge limits (e.g. < 1000 Coulombs at 56 days). Without a numerical Coulomb threshold, concrete mixes cannot be objectively validated for saline durability.',
        recommended_remedy: 'Mandate Rapid Chloride Permeability Test (RCPT) as per ASTM C1202 with maximum permitted charge of 1000 Coulombs at 56 days, paired with water permeability test as per DIN 1048.',
        suggested_clause: '"Marine structural concrete shall demonstrate chloride permeability not exceeding 1000 Coulombs at 56 days when tested in accordance with ASTM C1202, certified by third-party NABL laboratory."'
      },
      {
        risk_id: 'risk-civ-2',
        query_id: 'q-civ-marine-2026-03',
        requirement_id: 'req-civ-2',
        requirement_ref: 'Req #2 (Corrosion Protection of Rebars)',
        risk_type: 'MISSING_MATERIAL_SPEC',
        severity: 'MEDIUM',
        title: 'Corrosion-Resistant (CRS) Treatment Unspecified',
        description: 'In tidal marine splash zones, standard Fe 500D bars suffer rapid chloride pitting. For coastal berths, Corrosion Resistant Steel (CRS) grade with minimum copper/chromium micro-alloying under IS 1786 Amendment 3 should be specified.',
        recommended_remedy: 'Upgrade specification to Fe 500D CRS (Corrosion Resistant Steel) as defined in IS 1786, mandating corrosion resistance index (CRI) not less than 1.40.',
        suggested_clause: '"Reinforcement steel bars shall be Fe 500D CRS grade conforming to IS 1786 with combined Cu + Cr + P addition not less than 0.35%."'
      }
    ],
    coverage_matrix: {
      query_id: 'q-civ-marine-2026-03',
      requirements: [],
      standards: [],
      cells: {},
      gap_count: 0,
      gaps: [],
      coverage_percentage: 100.0
    },
    audit_logs: [
      {
        log_id: 301,
        query_id: 'q-civ-marine-2026-03',
        stage: 'EXTRACTION',
        stage_name: 'Civil Tender Extraction',
        model: 'claude-haiku-4.5',
        payload: { category: 'Civil Construction', sector: 'Construction & Building Materials' },
        duration_ms: 510,
        created_at: '2026-09-27T01:38:01.000Z',
        status: 'SUCCESS'
      },
      {
        log_id: 302,
        query_id: 'q-civ-marine-2026-03',
        stage: 'DECOMPOSITION',
        stage_name: 'Structural Requirement Breakdown',
        model: 'claude-haiku-4.5',
        payload: { count: 4, types: ['PRODUCT', 'SAFETY', 'TESTING', 'MATERIAL'] },
        duration_ms: 450,
        created_at: '2026-09-27T01:38:01.480Z',
        status: 'SUCCESS'
      },
      {
        log_id: 303,
        query_id: 'q-civ-marine-2026-03',
        stage: 'RETRIEVAL',
        stage_name: 'Hybrid Search (tsvector + pgvector)',
        model: 'all-MiniLM-L6-v2 (Local)',
        payload: { candidates: 16, merged_pool: 8 },
        duration_ms: 105,
        created_at: '2026-09-27T01:38:01.600Z',
        status: 'SUCCESS'
      },
      {
        log_id: 304,
        query_id: 'q-civ-marine-2026-03',
        stage: 'RERANKING',
        stage_name: 'Expert Engineering Re-Ranking',
        model: 'claude-sonnet-4.5',
        payload: { candidates_scored: 8, top_selected: 4 },
        duration_ms: 1100,
        created_at: '2026-09-27T01:38:02.750Z',
        status: 'SUCCESS'
      },
      {
        log_id: 305,
        query_id: 'q-civ-marine-2026-03',
        stage: 'RISK_DETECTION',
        stage_name: 'Civil Tender Specification Risk Detection',
        model: 'claude-sonnet-4.5',
        payload: { risks_identified: 2, severity_high: 1 },
        duration_ms: 920,
        created_at: '2026-09-27T01:38:03.700Z',
        status: 'SUCCESS'
      }
    ]
  }
};

// Wire up the coverage matrix cells for Case 1
const case1Reqs = PRESET_QUERIES.case1.requirements!;
const case1Stds = PRESET_QUERIES.case1.recommendations!.map(r => r.standard);
const case1Cells: Record<string, Record<string, any>> = {};

case1Reqs.forEach(r => {
  case1Cells[r.requirement_id] = {};
  case1Stds.forEach(s => {
    // Determine cell coverage
    let covered = false;
    let confidence = 0;
    if (r.requirement_id === 'req-1' && s.number.startsWith('IS/IEC 61439-2')) {
      covered = true; confidence = 97;
    } else if (r.requirement_id === 'req-5' && s.number.startsWith('IS/IEC 61439-2')) {
      covered = true; confidence = 62; // partial: design verification of enclosure degree of protection; no quantitative IP rating in the tender
    } else if (r.requirement_id === 'req-2' && s.number.startsWith('IS 12640')) {
      covered = true; confidence = 96;
    } else if (r.requirement_id === 'req-3' && s.number.startsWith('IS 3043')) {
      covered = true; confidence = 95;
    } else if (r.requirement_id === 'req-4' && (s.number.startsWith('IS 732') || s.number.startsWith('IS 1885'))) {
      covered = true; confidence = 90;
    }
    // req-6 (FRLS low smoke cable) has NO dedicated standard in the top surfaced results!
    case1Cells[r.requirement_id][s.standard_id] = {
      covered,
      standard_id: s.standard_id,
      evidence_passes: covered,
      match_confidence: confidence
    };
  });
});

PRESET_QUERIES.case1.coverage_matrix = {
  query_id: 'q-elec-substation-2026-01',
  requirements: case1Reqs,
  standards: case1Stds,
  cells: case1Cells,
  gap_count: 1,
  gaps: [case1Reqs[5]], // req-6 (FRLS cable spec)
  coverage_percentage: 83.3
};

// Wire up the coverage matrices for Case 2 and Case 3 (requirement id -> standard id -> match confidence).
// A requirement absent from the map has no covering standard in the surfaced results, so it is a gap.
const wireCoverage = (
  key: 'case2' | 'case3',
  queryId: string,
  covers: Record<string, Record<string, number>>
) => {
  const q = PRESET_QUERIES[key];
  const reqs = q.requirements!;
  const stds = q.recommendations!.map(r => r.standard);
  const cells: Record<string, Record<string, any>> = {};
  reqs.forEach(r => {
    cells[r.requirement_id] = {};
    stds.forEach(s => {
      const confidence = covers[r.requirement_id]?.[s.standard_id] ?? 0;
      cells[r.requirement_id][s.standard_id] = {
        covered: confidence > 0,
        standard_id: s.standard_id,
        evidence_passes: confidence > 0,
        match_confidence: confidence
      };
    });
  });
  const gaps = reqs.filter(r => !covers[r.requirement_id]);
  q.coverage_matrix = {
    query_id: queryId,
    requirements: reqs,
    standards: stds,
    cells,
    gap_count: gaps.length,
    gaps,
    coverage_percentage: Math.round(((reqs.length - gaps.length) / reqs.length) * 1000) / 10
  };
};

// Case 2: sub-zero drop impact (req-pkg-4) has no indexed standard, which is the gap.
wireCoverage('case2', 'q-pkg-rations-2026-02', {
  'req-pkg-1': { 'std-is-9845': 97 },
  'req-pkg-2': { 'std-is-10146': 93 },
  'req-pkg-3': { 'std-is-2771-1': 91 }
});

// Case 3: every requirement maps to a governing standard.
wireCoverage('case3', 'q-civ-marine-2026-03', {
  'req-civ-1': { 'std-is-1489-1': 98 },
  'req-civ-2': { 'std-is-1786': 97 },
  'req-civ-3': { 'std-is-456': 94 },
  'req-civ-4': { 'std-is-383': 92 }
});

// Wire up Knowledge Graph data
export const SAMPLE_KNOWLEDGE_GRAPHS: Record<string, StandardsGraph> = {
  'std-is-61439-2': {
    center_standard_id: 'std-is-61439-2',
    nodes: [
      { id: 'std-is-61439-2', number: 'IS/IEC 61439-2:2020', title: 'LV Power Switchgear and Controlgear Assemblies', sector_id: 1, sector_name: 'Electrical Safety', technical_committee: 'ETD 07', is_center: true },
      { id: 'std-is-12640-1', number: 'IS 12640-1:2016', title: 'RCCB Shock Protection', sector_id: 1, sector_name: 'Electrical Safety', technical_committee: 'ETD 32', relationship_to_center: 'SAFETY' },
      { id: 'std-is-3043', number: 'IS 3043:2018', title: 'Earthing Practice Code', sector_id: 1, sector_name: 'Electrical Safety', technical_committee: 'ETD 30', relationship_to_center: 'SUPPORTING' },
      { id: 'std-is-732', number: 'IS 732:2019', title: 'Electrical Wiring Installation', sector_id: 1, sector_name: 'Electrical Safety', technical_committee: 'ETD 20', relationship_to_center: 'SUPPORTING' },
      { id: 'std-is-1885-32', number: 'IS 1885 (Part 32):2019', title: 'Cables Electrotechnical Vocabulary', sector_id: 1, sector_name: 'Electrical Safety', technical_committee: 'ETD 20', relationship_to_center: 'TERMINOLOGY' },
      { id: 'std-is-694', number: 'IS 694:2010', title: 'PVC Insulated Cables', sector_id: 1, sector_name: 'Electrical Safety', technical_committee: 'ETD 20', relationship_to_center: 'INFERRED' },
    ],
    edges: [
      { id: 'e-sw1', source: 'std-is-61439-2', target: 'std-is-12640-1', relationship_type: 'SAFETY', is_inferred: true, rationale: 'Residual current devices are fitted in the feeder sections of the assembly (tender clause 2). Inferred from co-occurrence, not a verified normative reference.' },
      { id: 'e-sw2', source: 'std-is-61439-2', target: 'std-is-3043', relationship_type: 'SUPPORTING', is_inferred: true, rationale: 'The assembly protective circuit ties into the installation earthing designed under IS 3043 (tender clause 3). Inferred from co-occurrence.' },
      { id: 'e-sw3', source: 'std-is-61439-2', target: 'std-is-732', relationship_type: 'SUPPORTING', is_inferred: true, rationale: 'Wiring and conduit erection around the assembly follows the installation code (tender clause 5). Inferred from co-occurrence.' },
      { id: 'e-sw4', source: 'std-is-61439-2', target: 'std-is-1885-32', relationship_type: 'TERMINOLOGY', is_inferred: true, rationale: 'Shared electrotechnical vocabulary for conductors and insulation used across the tender documents.' },
      { id: 'e-sw5', source: 'std-is-61439-2', target: 'std-is-694', relationship_type: 'INFERRED', is_inferred: true, rationale: 'Cable insulation specification co-occurring in the same procurement schedule.' },
    ]
  },
  'std-is-302-1': {
    center_standard_id: 'std-is-302-1',
    nodes: [
      { id: 'std-is-302-1', number: 'IS 302-1:2008', title: 'General Safety of Household Appliances', sector_id: 1, sector_name: 'Electrical Safety', technical_committee: 'ETD 32', is_center: true },
      { id: 'std-is-12640-1', number: 'IS 12640-1:2016', title: 'RCCB Shock Protection', sector_id: 1, sector_name: 'Electrical Safety', technical_committee: 'ETD 32', relationship_to_center: 'SAFETY' },
      { id: 'std-is-3043', number: 'IS 3043:2018', title: 'Earthing Practice Code', sector_id: 1, sector_name: 'Electrical Safety', technical_committee: 'ETD 30', relationship_to_center: 'SUPPORTING' },
      { id: 'std-is-732', number: 'IS 732:2019', title: 'Electrical Wiring Installation', sector_id: 1, sector_name: 'Electrical Safety', technical_committee: 'ETD 20', relationship_to_center: 'SUPPORTING' },
      { id: 'std-is-1885-32', number: 'IS 1885 (Part 32):2019', title: 'Cables Electrotechnical Vocabulary', sector_id: 1, sector_name: 'Electrical Safety', technical_committee: 'ETD 20', relationship_to_center: 'TERMINOLOGY' },
      { id: 'std-is-694', number: 'IS 694:2010', title: 'PVC Insulated Cables', sector_id: 1, sector_name: 'Electrical Safety', technical_committee: 'ETD 20', relationship_to_center: 'INFERRED' },
      { id: 'std-is-302-2-3', number: 'IS 302-2-3:2017', title: 'Particular Safety: Electric Irons', sector_id: 1, sector_name: 'Electrical Safety', technical_committee: 'ETD 32', relationship_to_center: 'SUPPORTING' },
    ],
    edges: [
      { id: 'e1', source: 'std-is-302-1', target: 'std-is-12640-1', relationship_type: 'SAFETY', is_inferred: false, rationale: 'Normative reference for personnel shock mitigation and earth fault automatic disconnection.' },
      { id: 'e2', source: 'std-is-302-1', target: 'std-is-3043', relationship_type: 'SUPPORTING', is_inferred: false, rationale: 'Appliance Class I protective earthing continuity references IS 3043 installation practices.' },
      { id: 'e3', source: 'std-is-302-1', target: 'std-is-732', relationship_type: 'SUPPORTING', is_inferred: false, rationale: 'Wiring and supply cord termination rules reference IS 732 code.' },
      { id: 'e4', source: 'std-is-302-1', target: 'std-is-1885-32', relationship_type: 'TERMINOLOGY', is_inferred: true, rationale: 'Shared technical vocabulary for insulation resistance and dielectric materials.' },
      { id: 'e5', source: 'std-is-302-1', target: 'std-is-694', relationship_type: 'INFERRED', is_inferred: true, rationale: 'Co-occurring cable insulation specification in procurement schedules.' },
      { id: 'e6', source: 'std-is-302-1', target: 'std-is-302-2-3', relationship_type: 'PRIMARY', is_inferred: false, rationale: 'Part 2 particular standards directly inherit Part 1 general requirements.' },
    ]
  },
  'std-is-1489-1': {
    center_standard_id: 'std-is-1489-1',
    nodes: [
      { id: 'std-is-1489-1', number: 'IS 1489-1:2015', title: 'Portland Pozzolana Cement (Fly Ash)', sector_id: 3, sector_name: 'Construction & Building Materials', technical_committee: 'CED 2', is_center: true },
      { id: 'std-is-456', number: 'IS 456:2000', title: 'Plain & Reinforced Concrete Code', sector_id: 3, sector_name: 'Construction & Building Materials', technical_committee: 'CED 2', relationship_to_center: 'SUPPORTING' },
      { id: 'std-is-1786', number: 'IS 1786:2008', title: 'Fe 500D TMT Reinforcing Bars', sector_id: 3, sector_name: 'Construction & Building Materials', technical_committee: 'CED 54', relationship_to_center: 'SUPPORTING' },
      { id: 'std-is-383', number: 'IS 383:2016', title: 'Coarse and Fine Concrete Aggregates', sector_id: 3, sector_name: 'Construction & Building Materials', technical_committee: 'CED 2', relationship_to_center: 'SUPPORTING' },
    ],
    edges: [
      { id: 'e-c1', source: 'std-is-1489-1', target: 'std-is-456', relationship_type: 'SUPPORTING', is_inferred: false, rationale: 'IS 456 prescribes permitted cements and durability mix criteria referencing IS 1489.' },
      { id: 'e-c2', source: 'std-is-1489-1', target: 'std-is-1786', relationship_type: 'SUPPORTING', is_inferred: true, rationale: 'Co-occurring materials in structural reinforced concrete tender specifications.' },
      { id: 'e-c3', source: 'std-is-1489-1', target: 'std-is-383', relationship_type: 'SUPPORTING', is_inferred: false, rationale: 'Aggregate grading and alkali-silica reactivity interaction with Pozzolana cements.' },
    ]
  }
};
