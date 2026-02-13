
import React from 'react';
import { Cpu, Tv, WashingMachine, Speaker, Zap, Layers } from 'lucide-react';

export const APP_NAME = "ElectroPDF";

export const CATEGORIAS = [
  { id: '1', name: 'TV e Vídeo', slug: 'tv-video', icon: <Tv size={20} /> },
  { id: '2', name: 'Sistemas de Som', slug: 'som', icon: <Speaker size={20} /> },
  { id: '3', name: 'Eletrodomésticos', slug: 'eletrodomesticos', icon: <WashingMachine size={20} /> },
  { id: '4', name: 'Fontes e Módulos', slug: 'fontes', icon: <Zap size={20} /> },
  { id: '5', name: 'Componentes e CIs', slug: 'componentes', icon: <Cpu size={20} /> },
  { id: '6', name: 'Industrial e Automação', slug: 'industrial', icon: <Layers size={20} /> },
];

export const ACERVO_PDFS = [
  {
    id: 'p1',
    title: 'Esquema Elétrico Samsung UN55NU7100 - Fonte BN44-00932B',
    description: 'Diagrama detalhado da placa de fonte, lista de componentes e tensões de saída.',
    filename: 'samsung_un55_fonte.pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    categoryId: '1',
    tags: ['Samsung', 'TV', 'Fonte de Alimentação', 'Esquema'],
    views: 1250,
    downloads: 450,
    createdAt: '2024-05-15'
  },
  {
    id: 'p2',
    title: 'Manual de Serviço LG Inverter 12000 BTUs - Erros de Placa',
    description: 'Guia completo para diagnóstico de erros de comunicação e reparo da placa evaporadora.',
    filename: 'lg_inverter_manual.pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    categoryId: '3',
    tags: ['LG', 'Ar Condicionado', 'Inverter', 'Manual'],
    views: 3100,
    downloads: 820,
    createdAt: '2024-05-18'
  },
  {
    id: 'p3',
    title: 'Diagrama de Controle Lavadora Brastemp BWK12A',
    description: 'Esquema da placa de interface e potência, fiação completa e códigos de erro.',
    filename: 'brastemp_bwk12a_diagrama.pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    categoryId: '3',
    tags: ['Brastemp', 'Lavadora', 'Eletrodoméstico', 'Esquema'],
    views: 2100,
    downloads: 940,
    createdAt: '2024-05-20'
  },
  {
    id: 'p4',
    title: 'Manual Técnico Módulo Amplificador Taramps HD 3000',
    description: 'Guia para reparo de saída, tensões da fonte chaveada e componentes críticos.',
    filename: 'taramps_hd3000.pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    categoryId: '2',
    tags: ['Taramps', 'Som Automotivo', 'Amplificador', 'Reparo'],
    views: 4500,
    downloads: 1200,
    createdAt: '2024-05-21'
  }
];
