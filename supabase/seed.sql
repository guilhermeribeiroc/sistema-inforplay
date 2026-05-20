-- ============================================================
-- INFORPLAY - Carga de Produtos (233 registros)
-- Extraído do PDF: produtos-2026-05-18.pdf
-- Execute APÓS o schema.sql e rls.sql
-- ============================================================

INSERT INTO products (code, name, sector, unit, cost, sale_price) VALUES

-- ============ ACRÍLICOS ============
('C4X4V',  '500 CARTÕES VERNIZ 4X4',                            'ALMOXARIFADO', 'UN', 50.00,   120.00),
('ACR4T',  'ACRILICO 4MM TRANSPARENTE',                         'ALMOXARIFADO', 'M2', 500.00,  1000.00),
('ACR4M',  'ACRILICO 4MM TRANSPARENTE BRUNO',                   'ALMOXARIFADO', 'M2', 50.00,   800.00),
('ACRA',   'ACRILICO ADESIVADO',                                'ALMOXARIFADO', 'M2', 200.00,  560.00),
('ACRC',   'ACRILICO COLOR',                                    'ALMOXARIFADO', 'M2', 200.00,  500.00),
('ACCT',   'ACRILICO COLOR/TRANS TERCEIRIZADO',                 'ALMOXARIFADO', 'M2', 50.00,   400.00),
('ACRCT',  'ACRILICO COLOR/TRANSPARENTE BRUNO',                 'ALMOXARIFADO', 'M2', 50.00,   350.00),
('ACRCC',  'ACRILICO COLOR/TRANSPARENTE C/ CORROSAO BRUNO',     'ALMOXARIFADO', 'M2', 50.00,   430.00),
('ACT',    'ACRILICO CORROSAO TERCERIZADO',                     'ALMOXARIFADO', 'M2', 50.00,   430.00),
('ACD',    'ACRILICO DOURADO BRUNO COM FITA',                   'ALMOXARIFADO', 'M2', 50.00,   500.00),
('ADDF',   'ACRILICO DOURADO C/ FITA DUPLA FACE',              'ALMOXARIFADO', 'M2', 50.00,   700.00),
('ADTF',   'ACRILICO DOURADO TERCERIZADO COM FITA',             'ALMOXARIFADO', 'M2', 50.00,   550.00),
('ACRE',   'ACRILICO ESPELHADO',                                'ALMOXARIFADO', 'M2', 300.00,  650.00),
('ACRES',  'ACRILICO ESPELHADO BRUNO',                          'ALMOXARIFADO', 'M2', 50.00,   450.00),
('ACRCB',  'ACRILICO ESPELHADO C/ CORROSAO BRUNO',              'ALMOXARIFADO', 'M2', 50.00,   470.00),
('ACET',   'ACRILICO ESPELHADO TERCEIRIZADO',                   'ALMOXARIFADO', 'M2', 50.00,   500.00),
('ACRT',   'ACRILICO TRANSPARENTE 2MM',                        'ALMOXARIFADO', 'M2', 200.00,  500.00),
('AC3MM',  'ACRILICO TRANSPARENTE 3MM',                        'ALMOXARIFADO', 'M2', 500.00,  800.00),

-- ============ ADESIVOS ============
('ASDCC',  'ADESIVO BRUNO LEITOSO/TRANSPARENTE C/ CORTE',       'ALMOXARIFADO', 'M2', 15.00,   35.00),
('ADSSC',  'ADESIVO BRUNO LEITOSO/TRANSPARENTE S/ CORTE',       'ALMOXARIFADO', 'M2', 10.00,   32.00),
('ADFC',   'ADESIVO FOSCO CCEE',                                'ALMOXARIFADO', 'M2', 27.50,   55.00),
('ADFIM',  'ADESIVO FOSCO IMPRESSO',                            'ALMOXARIFADO', 'M2', 15.00,   65.00),
('ADLD',   'ADESIVO LEITOSO DIVERSOS',                          'ALMOXARIFADO', 'M2', 10.00,   35.00),
('ADLE',   'ADESIVO LEITOSO IMPRESSO',                          'ALMOXARIFADO', 'M2', 15.00,   65.00),
('ADSSI',  'ADESIVO LEITOSO SEM IMPRESSAO',                     'ALMOXARIFADO', 'M2', 15.00,   25.00),
('ALTC',   'ADESIVO LEITOSO/TRANSP CCEE',                      'ALMOXARIFADO', 'M2', 25.00,   50.00),
('ADMI',   'ADESIVO MILHEIRO IMPRESSO',                         'ALMOXARIFADO', 'UN', 10.00,   30.00),
('ADVMU',  'ADESIVO MUSSIDIM',                                  'ALMOXARIFADO', 'UN', 0.01,    0.08),
('ADBL',   'ADESIVO PARA BALÃO',                               'ALMOXARIFADO', 'UN', 3.00,    10.00),
('ADP1',   'ADESIVO PERFURADO 0,60X0,30',                      'ALMOXARIFADO', 'UN', 1.00,    6.90),
('ADP2',   'ADESIVO PERFURADO 0,70X0,33',                      'ALMOXARIFADO', 'UN', 1.00,    8.90),
('ADPD',   'ADESIVO PERFURADO DIVERSOS',                        'ALMOXARIFADO', 'M2', 1.00,    40.00),
('APHB',   'ADESIVO PERFURADO HILUX ABERTA',                    'ALMOXARIFADO', 'UN', 1.00,    19.90),
('APHF',   'ADESIVO PERFURADO HILUX FECHADA',                   'ALMOXARIFADO', 'UN', 1.00,    25.90),
('ADPER',  'ADESIVO PERFURADO IMPRESSO',                        'ALMOXARIFADO', 'M2', 20.00,   70.00),
('ADMOT',  'ADESIVO QUADRADO 0,10X0,10 MOTO (CENTO)',          'ALMOXARIFADO', 'UN', 1.00,    35.00),
('ADSR',   'ADESIVO RECORTE',                                   'ALMOXARIFADO', 'M2', 15.00,   30.00),
('AD30',   'ADESIVO REDONDO 0,30X0,30',                        'ALMOXARIFADO', 'UN', 1.00,    2.99),
('AD4',    'ADESIVO REDONDO 0,40X0,40',                        'ALMOXARIFADO', 'UN', 2.00,    5.90),
('AD50',   'ADESIVO REDONDO 0,50X0,50',                        'ALMOXARIFADO', 'UN', 1.00,    8.50),
('ADR2',   'ADESIVO RETANGULAR 0,15X0,7',                      'ALMOXARIFADO', 'UN', 0.10,    0.35),
('ADR1',   'ADESIVO RETANGULAR 0,30X0,125',                    'ALMOXARIFADO', 'UN', 0.50,    1.25),
('ADVT',   'ADESIVO TERCEIRIZADO LEIT/TRANS 1',                'ALMOXARIFADO', 'M2', 10.00,   35.00),
('ADVT2',  'ADESIVO TERCEIRIZADO LEIT/TRANS 2',                'ALMOXARIFADO', 'M2', 10.00,   40.00),
('ADST3',  'ADESIVO TERCEIRIZADO LEIT/TRANS 3',                'ALMOXARIFADO', 'M2', 10.00,   50.00),
('ADVTS',  'ADESIVO TERCEIRIZADO LEIT/TRANS S/ CORTE',         'ALMOXARIFADO', 'M2', 15.00,   32.00),
('ADVTM',  'ADESIVO TERCEIRIZADO MILHEIRO',                     'ALMOXARIFADO', 'UN', 10.00,   25.00),
('ADVPF',  'ADESIVO TERCEIRIZADO PERFURADO/FOSCO 1',           'ALMOXARIFADO', 'M2', 10.00,   45.00),
('ADSTT',  'ADESIVO TERCEIRIZADO PERFURADO/FOSCO 2',           'ALMOXARIFADO', 'M2', 10.00,   50.00),
('ADV33',  'ADESIVO TERCEIRIZADO PERFURADO/FOSCO 3',           'ALMOXARIFADO', 'M2', 10.00,   60.00),
('ATA',    'ADESIVO TRANSPARENTE AUTOMOTIVO',                   'ALMOXARIFADO', 'M2', 20.00,   35.00),
('ADTRA',  'ADESIVO TRANSPARENTE IMPRESSO',                     'ALMOXARIFADO', 'M2', 15.00,   65.00),

-- ============ ALMOFADA / APLICAÇÃO / ARTE ============
('ALMC',   'ALMOFADA COMPLETA',                                 'ALMOXARIFADO', 'UN', 20.00,   54.90),
('AAD',    'APLICACAO ADESIVO',                                 'ALMOXARIFADO', 'M2', 10.00,   25.00),
('ARTD',   'ARTE DIVERSA',                                      'ALMOXARIFADO', 'UN', 10.00,   120.00),
('ARTD2',  'ARTES DIVERSAS',                                    'ALMOXARIFADO', 'UN', 50.00,   100.00),

-- ============ AZULEJOS ============
('AZGP',   'AZULEJO G PERSONALIZADO',                           'ALMOXARIFADO', 'UN', 10.00,   39.90),
('AZPP',   'AZULEJO P PERSONALIZADO',                           'ALMOXARIFADO', 'UN', 15.00,   35.90),

-- ============ BALÕES / BANDEIRAS ============
('BALP',   'BALAO PERSONALIZADO 1',                             'ALMOXARIFADO', 'UN', 25.00,   59.90),
('BALP2',  'BALAO PERSONALIZADO 2',                             'ALMOXARIFADO', 'UN', 25.00,   69.90),
('BALP3',  'BALAO PERSONALIZADO 3',                             'ALMOXARIFADO', 'UN', 25.00,   99.90),
('BALGE',  'BALDE DE GELO PERSONALIZADO',                       'ALMOXARIFADO', 'UN', 15.00,   39.90),
('BAN1',   'BANDEIRA 1,0X0,70',                                'ALMOXARIFADO', 'UN', 1.00,    15.90),
('BANDC',  'BANDEIRA CARRO',                                    'ALMOXARIFADO', 'UN', 1.50,    6.00),
('BAN2',   'BANDEIRAO 1,5X1,0',                                'ALMOXARIFADO', 'UN', 1.00,    29.90),
('BAN3',   'BANDEIRAO 2,5X1,5',                                'ALMOXARIFADO', 'UN', 1.00,    45.90),

-- ============ BANNERS ============
('BANNE',  'BANNER',                                            'ALMOXARIFADO', 'M2', 30.00,   65.00),
('BAM',    'BANNER ACAB. MADEIRA CCEE',                        'ALMOXARIFADO', 'M2', 25.00,   50.00),

-- ============ BLOCOS ============
('BL100',  'BLOCO 10X15 ENCADERNADO C/ 100 FLS',               'ALMOXARIFADO', 'UN', 5.00,    9.90),
('BLE50',  'BLOCO 10X15 ENCADERNADO C/ 50 FLS',                'ALMOXARIFADO', 'UN', 1.00,    5.90),
('BLB21',  'BLOCO BINGO 2X1 C/ 50 UND',                        'ALMOXARIFADO', 'UN', 7.50,    15.00),
('BLB41',  'BLOCO BINGO 4X1 C/ 50 UND',                        'ALMOXARIFADO', 'UN', 4.00,    8.00),
('BLC41',  'BLOCO COMANDA 4X1 C/ 100 UND',                     'ALMOXARIFADO', 'UN', 4.00,    8.00),
('BLR21',  'BLOCO RECIBO 2X1 C/ 50 UND',                       'ALMOXARIFADO', 'UN', 5.00,    15.00),
('BLS',    'BLOCO SORTEIO C/ 100 UND',                         'ALMOXARIFADO', 'UN', 6.00,    12.00),

-- ============ BLUSAS / BROCHES ============
('BLUP',   'BLUSA PERSONALIZADA',                               'ALMOXARIFADO', 'UN', 15.00,   32.00),
('BLUFV',  'BLUSA PERSONALIZADA FRENTE E VERSO',               'ALMOXARIFADO', 'UN', 15.00,   37.00),
('BROD',   'BROCHES DIVERSOS',                                  'ALMOXARIFADO', 'UN', 2.00,    8.00),

-- ============ BORRACHAS / BOTONS ============
('BRRC',   'BORRACHA CARIMBO 4910',                             'ALMOXARIFADO', 'UN', 6.00,    12.00),
('BT10',   'BORRACHA CARIMBO 4910 TERCERIZADO',                'ALMOXARIFADO', 'UN', 5.00,    10.00),
('B4911',  'BORRACHA CARIMBO 4911',                             'ALMOXARIFADO', 'UN', 6.00,    14.00),
('BT11',   'BORRACHA CARIMBO 4911 TERCERIZADO',                'ALMOXARIFADO', 'UN', 5.00,    12.00),
('B4912',  'BORRACHA CARIMBO 4912',                             'ALMOXARIFADO', 'UN', 6.00,    16.00),
('BT12',   'BORRACHA CARIMBO 4912 TERCERIZADO',                'ALMOXARIFADO', 'UN', 6.00,    14.00),
('BCM2',   'BORRACHA CARIMBO M2',                               'ALMOXARIFADO', 'M2', 500.00,  5000.00),
('BT10B',  'BOTON 0,10X0,10 (CENTO)',                          'ALMOXARIFADO', 'UN', 15.00,   35.00),
('BT8',    'BOTON 0,8X0,8 (CENTO)',                            'ALMOXARIFADO', 'UN', 15.00,   22.00),
('BT3',    'BOTON 3,5CM',                                      'ALMOXARIFADO', 'UN', 1.50,    3.90),
('BT5',    'BOTON 5,5CM',                                      'ALMOXARIFADO', 'UN', 2.50,    7.90),

-- ============ CADERNETAS ============
('CADF',   'CADERNETA DE VACINA FEM',                           'ALMOXARIFADO', 'UN', 15.00,   44.90),
('CADM',   'CADERNETA DE VACINA MASC',                          'ALMOXARIFADO', 'UN', 15.00,   44.90),

-- ============ CAIXAS / CANECAS ============
('CXECA',  'CAIXA EXPLOSAO PARA CANECA',                        'ALMOXARIFADO', 'UN', 20.00,   55.00),
('CXACR',  'CAIXINHA DE ACRILICO',                              'ALMOXARIFADO', 'UN', 10.00,   15.00),
('CXMDF',  'CAIXINHA DE MDF DIVERSAS',                          'ALMOXARIFADO', 'UN', 10.00,   15.00),
('CANCH',  'CANECA CHOPP',                                      'ALMOXARIFADO', 'UN', 2.50,    5.90),
('CANCJ',  'CANECA CHOPP JATEADA',                              'ALMOXARIFADO', 'UN', 2.50,    8.90),
('CANLN',  'CANECA LONG NECK JATEADA',                          'ALMOXARIFADO', 'UN', 2.50,    7.90),
('CANP',   'CANECA PORCELANA PERSONALIZADA',                    'ALMOXARIFADO', 'UN', 15.00,   32.90),

-- ============ CAPACHOS ============
('CAPAA',  'CAPA ALMOFADA',                                     'ALMOXARIFADO', 'UN', 10.00,   34.90),
('CAPP',   'CAPACHO PERSONALIZADO',                             'ALMOXARIFADO', 'M2', 250.00,  500.00),
('CPC',    'CAPACHO PERSONALIZADO 1,0X0,60',                   'ALMOXARIFADO', 'UN', 100.00,  250.00),
('CAPT',   'CAPACHO TERCEIRIZADO',                              'ALMOXARIFADO', 'UN', 150.00,  220.00),

-- ============ CARDÁPIO / CARIMBOS ============
('CARD',   'CARDAPIO',                                          'ALMOXARIFADO', 'UN', 15.90,   29.90),
('C4910',  'CARIMBO 4910',                                      'ALMOXARIFADO', 'UN', 29.90,   32.90),
('C4911',  'CARIMBO 4911',                                      'ALMOXARIFADO', 'UN', 39.90,   42.90),
('C4911T', 'CARIMBO 4911 TRODAT',                               'ALMOXARIFADO', 'UN', 20.00,   49.90),
('C4912',  'CARIMBO 4912',                                      'ALMOXARIFADO', 'UN', 49.90,   52.90),
('C4913',  'CARIMBO 4913',                                      'ALMOXARIFADO', 'UN', 59.90,   59.90),
('CARMD',  'CARIMBO MADEIRA DIVERSOS',                          'ALMOXARIFADO', 'UN', 35.00,   35.00),
('CMMM',   'CARIMBO MADEIRA MM',                                'ALMOXARIFADO', 'M2', 1000.00, 8000.00),
('CMT',    'CARIMBO MADEIRA MM TERCEIRIZADO',                   'ALMOXARIFADO', 'M2', 1000.00, 6000.00),

-- ============ CARTÕES DE VISITA ============
('CVF',    'CARTAO DE VISITA C/ 100 UND FOTOGRAFICO',           'ALMOXARIFADO', 'UN', 40.00,   40.00),
('CVL',    'CARTAO DE VISITA C/ 100 UND LASER',                'ALMOXARIFADO', 'UN', 35.00,   35.00),
('CVLFV',  'CARTAO DE VISITA C/ 100 UND LASER F/V',            'ALMOXARIFADO', 'UN', 55.00,   55.00),
('CVP60',  'CARTAO DE VISITA C/ 100 UND P.60',                 'ALMOXARIFADO', 'UN', 25.00,   25.00),
('CV6FV',  'CARTAO DE VISITA C/ 100 UND P.60 F/V',             'ALMOXARIFADO', 'UN', 40.00,   40.00),
('CVP',    'CARTAO DE VISITA C/ 100 UND PLASTIFICADO',          'ALMOXARIFADO', 'UN', 45.00,   45.00),
('CVPFV',  'CARTAO DE VISITA C/ 100 UND PLASTIFICADO F/V',     'ALMOXARIFADO', 'UN', 60.00,   60.00),

-- ============ CHAPÉU / CHAVEIROS / COFRE ============
('CPG',    'CARTILHA PLANO DE GOVERNO',                         'ALMOXARIFADO', 'UN', 2.00,    5.00),
('CPA',    'CHAPEU DE PALHA',                                   'ALMOXARIFADO', 'UN', 5.00,    28.90),
('CHAVA',  'CHAVEIRO 3/4 ACRILICO',                             'ALMOXARIFADO', 'UN', 2.50,    5.00),
('COFRE',  'COFRE PERSONALIZADO',                               'ALMOXARIFADO', 'UN', 1.50,    4.50),
('CMD',    'COMENDA',                                           'ALMOXARIFADO', 'UN', 25.90,   59.90),

-- ============ CONVITES / COPOS ============
('CONVD',  'CONVITE DIVERSOS',                                  'ALMOXARIFADO', 'UN', 2.00,    4.50),
('CONV',   'CONVITE VIRTUAL',                                   'ALMOXARIFADO', 'UN', 15.00,   30.00),
('CP400',  'COPO ECOLABEL 400ML',                               'ALMOXARIFADO', 'UN', 3.00,    6.90),
('CP550',  'COPO ECOLABEL 550ML',                               'ALMOXARIFADO', 'UN', 3.50,    7.50),
('COPEU',  'COPO EUPHORIA',                                     'ALMOXARIFADO', 'UN', 2.50,    6.50),
('COPLD',  'COPO LONG DRINK',                                   'ALMOXARIFADO', 'UN', 1.50,    3.50),

-- ============ CORTE / CRACHÁ ============
('CTLA4',  'CORTE A LASER A4',                                  'ALMOXARIFADO', 'UN', 1.00,    5.00),
('COREC',  'CORTE A LASER EVA/CARTOLINA',                       'ALMOXARIFADO', 'UN', 5.00,    10.00),
('CTL',    'CORTE TOPO LAMICOTE',                               'ALMOXARIFADO', 'UN', 5.00,    10.00),
('CRPC',   'CRACHA 4X1 PLAST. + CORDAO',                       'ALMOXARIFADO', 'UN', 2.50,    4.90),
('CRAP',   'CRACHA PVC PERSONALIZADO',                          'ALMOXARIFADO', 'UN', 10.00,   19.90),
('CRAT',   'CRACHA TERCEIRIZADO',                               'ALMOXARIFADO', 'UN', 10.00,   14.90),

-- ============ ENVELOPE / FOTO / GARRAFA ============
('ENVP',   'ENVELOPE PERSONALIZADO',                            'ALMOXARIFADO', 'UN', 1.50,    3.00),
('FOTOP',  'FOTO POLAROIDE',                                    'ALMOXARIFADO', 'UN', 0.50,    1.50),
('GSP',    'GARRAFA SQUEEZE PLASTICA',                          'ALMOXARIFADO', 'UN', 2.50,    5.90),

-- ============ GRAVAÇÃO / IMPRESSÃO ============
('GLMD',   'GRAVACAO LASER MADEIRA',                            'ALMOXARIFADO', 'HH', 1.50,    3.00),
('IMPA3',  'IMPRESSAO A LASER A3 CCEE',                        'ALMOXARIFADO', 'UN', 2.50,    5.00),
('IMPA4',  'IMPRESSAO A LASER A4 CCEE',                        'ALMOXARIFADO', 'UN', 1.50,    3.00),
('IMPA0',  'IMPRESSAO A0',                                      'ALMOXARIFADO', 'UN', 10.00,   30.00),
('IMPA1',  'IMPRESSAO A1',                                      'ALMOXARIFADO', 'UN', 5.00,    16.00),
('IMPA2',  'IMPRESSAO A2',                                      'ALMOXARIFADO', 'UN', 5.00,    10.00),
('IMPP',   'IMPRESSAO A3 + PLASTIFICACAO',                      'ALMOXARIFADO', 'UN', 5.00,    11.00),
('IMPC',   'IMPRESSAO CAPACHO TERCERIZADA',                     'ALMOXARIFADO', 'UN', 75.00,   150.00),
('IMPL',   'IMPRESSAO LASER',                                   'ALMOXARIFADO', 'UN', 1.50,    3.00),
('IMUV',   'IMPRESSAO UV',                                      'ALMOXARIFADO', 'M2', 50.00,   200.00),
('IMPUV',  'IMPRESSAO UV TERCERIZADA',                          'ALMOXARIFADO', 'M2', 30.00,   100.00),

-- ============ JOGO / KIT / LEQUE ============
('JGA',    'JOGO AMERICANO',                                    'ALMOXARIFADO', 'UN', 10.00,   29.90),
('KITBC',  'KIT BLOCO + CANETA + CHAVEIRO',                    'ALMOXARIFADO', 'UN', 5.00,    9.90),
('LAP',    'LEQUE ABANADOR PERSONALIZADO 180G',                 'ALMOXARIFADO', 'UN', 1.00,    3.90),
('LIVRE',  'LIVRETO',                                           'ALMOXARIFADO', 'UN', 1.00,    2.90),
('LOMD',   'LOGO MARCA DIVERSAS',                               'ALMOXARIFADO', 'UN', 25.00,   60.00),

-- ============ LONAS ============
('LCI',    'LONA COM ILHOIS TERCEIRIZADA',                      'ALMOXARIFADO', 'M2', 15.00,   48.00),
('LONAI',  'LONA COM ILHOS CCEE',                              'ALMOXARIFADO', 'M2', 30.00,   60.00),
('LORIL',  'LONA COM REFORO E ILHOS',                           'ALMOXARIFADO', 'M2', 20.00,   70.00),
('LDP',    'LONA DIVERSA PREFEITURA',                           'ALMOXARIFADO', 'M2', 25.00,   90.00),
('LOSA',   'LONA SEM ACABAMENTO',                               'ALMOXARIFADO', 'M2', 15.00,   60.00),
('LTCA',   'LONA TERCEIRIZADA C/ ACABAMENTO',                  'ALMOXARIFADO', 'M2', 15.00,   35.00),
('LTSA',   'LONA TERCEIRIZADA S/ ACABAMENTO',                  'ALMOXARIFADO', 'M2', 15.00,   32.00),
('LUMI',   'LUMINARIA C/ ACRILICO',                             'ALMOXARIFADO', 'UN', 25.00,   59.90),

-- ============ MDF 3MM ============
('MPG',    'MARCA PAGINA',                                      'ALMOXARIFADO', 'UN', 0.50,    1.00),
('MDF3A',  'MDF 3MM ADESIVADO BRUNO',                           'ALMOXARIFADO', 'M2', 50.00,   152.00),
('MDF3AP', 'MDF 3MM ADESIVADO/PINTADO',                         'ALMOXARIFADO', 'M2', 100.00,  260.00),
('3MMT',   'MDF 3MM ADESIVADO/PINTADO TERCEIRIZADO',            'ALMOXARIFADO', 'M2', 50.00,   182.00),
('MDF3B',  'MDF 3MM BRANCO',                                    'ALMOXARIFADO', 'M2', 100.00,  350.00),
('MDF3BB', 'MDF 3MM BRANCO BRUNO',                              'ALMOXARIFADO', 'M2', 50.00,   220.00),
('MDFBC',  'MDF 3MM BRANCO C/ CORROSAO BRUNO',                 'ALMOXARIFADO', 'M2', 50.00,   250.00),
('MDF3T',  'MDF 3MM BRANCO TERCEIRIZADO',                       'ALMOXARIFADO', 'M2', 50.00,   280.00),
('MDF3CF', 'MDF 3MM CORROSAO FINAL',                            'ALMOXARIFADO', 'M2', 500.00,  1000.00),
('MDF3CT', 'MDF 3MM CORROSAO TERCERIZADO',                      'ALMOXARIFADO', 'M2', 500.00,  800.00),
('MDF3C',  'MDF 3MM CRU',                                       'ALMOXARIFADO', 'M2', 100.00,  200.00),
('MDF3CB', 'MDF 3MM CRU BRUNO',                                 'ALMOXARIFADO', 'M2', 50.00,   120.00),
('MDFCC',  'MDF 3MM CRU C/ CORROSAO BRUNO',                    'ALMOXARIFADO', 'M2', 50.00,   150.00),
('MDF3P',  'MDF 3MM CRU PINTADO TERCEIRIZADO',                  'ALMOXARIFADO', 'M2', 50.00,   180.00),
('MDF3CTE','MDF 3MM CRU TERCEIRIZADO',                          'ALMOXARIFADO', 'M2', 50.00,   150.00),

-- ============ MDF 6MM ============
('MD6T',   'MDF 6MM ADESIVADO TERCEIRIZADO',                    'ALMOXARIFADO', 'M2', 50.00,   380.00),
('MDF6A',  'MDF 6MM ADESIVADO/PINTADO',                         'ALMOXARIFADO', 'M2', 200.00,  460.00),
('MDF6B',  'MDF 6MM BRANCO',                                    'ALMOXARIFADO', 'M2', 200.00,  450.00),
('MDF6BB', 'MDF 6MM BRANCO BRUNO',                              'ALMOXARIFADO', 'M2', 50.00,   300.00),
('MDF6C',  'MDF 6MM BRANCO C/ CORROSAO BRUNO',                 'ALMOXARIFADO', 'M2', 50.00,   330.00),
('MDF6BT', 'MDF 6MM BRANCO TERCEIRIZADO',                       'ALMOXARIFADO', 'M2', 50.00,   380.00),
('MDF6CRU','MDF 6MM CRU',                                       'ALMOXARIFADO', 'M2', 200.00,  400.00),
('MDF6CB', 'MDF 6MM CRU BRUNO',                                 'ALMOXARIFADO', 'M2', 50.00,   200.00),
('MDF6CC', 'MDF 6MM CRU C/ CORROSAO BRUNO',                    'ALMOXARIFADO', 'M2', 50.00,   230.00),
('MDF6T',  'MDF 6MM CRU TERCEIRIZADO',                          'ALMOXARIFADO', 'M2', 50.00,   300.00),

-- ============ MEDALHAS ============
('MED6',   'MEDALHA ACRILICO 6X6',                              'ALMOXARIFADO', 'UN', 1.50,    4.90),
('MED6R',  'MEDALHA ACRILICO 6X6 RESINADA',                    'ALMOXARIFADO', 'UN', 2.50,    6.90),

-- ============ PANFLETOS / PAPEL ============
('PA2LP',  'PANFLETO 2X1 LASER PERSONALIZADO',                  'ALMOXARIFADO', 'UN', 0.50,    1.00),
('PA21P',  'PANFLETO 2X1 PERSONALIZADO',                        'ALMOXARIFADO', 'UN', 0.25,    0.75),
('PA4LP',  'PANFLETO 4X1 LASER PERSONALIZADO',                  'ALMOXARIFADO', 'UN', 0.25,    0.75),
('PA41P',  'PANFLETO 4X1 PERSONALIZADO',                        'ALMOXARIFADO', 'UN', 0.10,    0.40),
('PAPP',   'PAPEL DE PAREDE',                                   'ALMOXARIFADO', 'M2', 40.00,   80.00),
('PFP',    'PAPEL FOTO PLOTER',                                  'ALMOXARIFADO', 'M2', 50.00,   100.00),
('PFT',    'PAPEL FOTO PLOTER TERCERIZADO',                     'ALMOXARIFADO', 'M2', 50.00,   75.00),
('PP',     'PAPEL PLOTADO',                                     'ALMOXARIFADO', 'M2', 10.00,   30.00),
('PAPL',   'PAPEL PLOTADO CCEE',                                'ALMOXARIFADO', 'M2', 15.00,   30.00),
('PPT',    'PAPEL PLOTADO TERCERIZADO',                         'ALMOXARIFADO', 'M2', 10.00,   25.00),
('PARAA',  'PARANA ADESIVADO',                                  'ALMOXARIFADO', 'M2', 50.00,   100.00),

-- ============ PLACAS / PULSEIRAS ============
('PPIXA',  'PLACA PIX DE ACRILICO',                             'ALMOXARIFADO', 'UN', 20.00,   49.90),
('PLSN',   'PLACAS DE SINALIZACAO',                             'ALMOXARIFADO', 'UN', 5.00,    12.00),
('PULP',   'PULSEIRA PERSONALIZADA',                            'ALMOXARIFADO', 'UN', 0.10,    0.60),

-- ============ PVC ============
('PVCUV',  'PVC + IMPRESSAO UV',                                'ALMOXARIFADO', 'M2', 150.00,  400.00),
('PVC1',   'PVC 1MM',                                           'ALMOXARIFADO', 'M2', 30.00,   80.00),
('PVC1A',  'PVC 1MM ADESIVADO',                                 'ALMOXARIFADO', 'M2', 50.00,   125.00),
('PVCAT',  'PVC 1MM ADESIVADO TERCERIZADO',                     'ALMOXARIFADO', 'M2', 40.00,   100.00),
('PVC1T',  'PVC 1MM TERCERIZADO',                               'ALMOXARIFADO', 'M2', 20.00,   50.00),
('PVCAD',  'PVC ADESIVADO',                                     'ALMOXARIFADO', 'M2', 60.00,   360.00),
('PVC3A',  'PVC ADESIVADO 3MM',                                 'ALMOXARIFADO', 'M2', 200.00,  410.00),
('PVCAT2', 'PVC ADESIVADO TERCERIZADO',                         'ALMOXARIFADO', 'M2', 100.00,  232.00),
('PVCA3',  'PVC ADESIVADO TERCERIZADO 3MM',                     'ALMOXARIFADO', 'M2', 0.00,    282.00),
('PVCB',   'PVC BRUNO',                                         'ALMOXARIFADO', 'M2', 50.00,   180.00),
('PVC',    'PVC COMUM 2MM',                                     'ALMOXARIFADO', 'M2', 40.00,   300.00),
('PVC3',   'PVC COMUM 3MM',                                     'ALMOXARIFADO', 'M2', 200.00,  350.00),
('PVCT',   'PVC TERCEIRIZADO',                                  'ALMOXARIFADO', 'M2', 50.00,   200.00),
('PVC3T',  'PVC TERCERIZADO 3MM',                               'ALMOXARIFADO', 'M2', 200.00,  250.00),

-- ============ QUADROS / SACOLAS ============
('QCA4',   'QUADRO P/ CERTIFICADO A4',                          'ALMOXARIFADO', 'UN', 15.00,   29.90),
('SACAN',  'SACOLINHA PARA ANIVERSARIO',                        'ALMOXARIFADO', 'UN', 1.00,    4.90),

-- ============ SANTINHOS / SUBLIMAÇÃO ============
('SANT',   'SANTINHO 0,10X0,7 CM (MILHEIRO)',                  'ALMOXARIFADO', 'UN', 0.05,    0.10),
('SANTF',  'SANTINHO FINADOS',                                  'ALMOXARIFADO', 'UN', 0.50,    1.00),
('SBL',    'SUBLIMACAO DIVERSAS',                               'ALMOXARIFADO', 'UN', 5.00,    10.00),

-- ============ TAÇAS / TAGS ============
('TACC',   'TACA CHAMPANHE',                                    'ALMOXARIFADO', 'UN', 2.50,    5.90),
('TAGJ',   'TACA GIN JATEADA',                                  'ALMOXARIFADO', 'UN', 5.00,    14.90),
('TAGTC',  'TACA GIN TRANSPARENTE/COLOR',                       'ALMOXARIFADO', 'UN', 5.00,    9.90),
('TAGR',   'TAG PARA ROUPA C/ 100 UND',                        'ALMOXARIFADO', 'UN', 10.00,   25.00),
('TAGFV',  'TAG PARA ROUPA C/ 100 UND F/V',                    'ALMOXARIFADO', 'UN', 20.00,   40.00),

-- ============ TECIDO / TOPO / TROFÉUS ============
('TECI',   'TECIDO IMPRESSO',                                   'ALMOXARIFADO', 'M2', 75.00,   150.00),
('TECT',   'TECIDO TERCEIRIZADO',                               'ALMOXARIFADO', 'M2', 35.00,   75.00),
('TBOLO',  'TOPO DE BOLO ACRILICO',                             'ALMOXARIFADO', 'UN', 10.00,   29.90),
('TROD1',  'TROFEU DIVERSOS 1',                                 'ALMOXARIFADO', 'UN', 50.00,   220.00),
('TROD2',  'TROFEU DIVERSOS 2',                                 'ALMOXARIFADO', 'UN', 50.00,   180.00),
('TROD3',  'TROFEU DIVERSOS 3',                                 'ALMOXARIFADO', 'UN', 50.00,   140.00);

-- Confirmação de carga
DO $$
DECLARE
  total_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_count FROM products;
  RAISE NOTICE 'Total de produtos inseridos: %', total_count;
END;
$$;
