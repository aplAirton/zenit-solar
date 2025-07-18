# Documentação Técnica - Zênite Solar

## 🏗️ Arquitetura da Aplicação

### Estrutura de Componentes

```
src/
├── components/
│   ├── Globe.tsx           # Visualização 3D com textura real da Terra
│   ├── MercatorMap.tsx     # Projeção Mercator em SVG
│   ├── DateControl.tsx     # Controles de data e hora
│   ├── SolarInfo.tsx       # Painel de informações solares
│   └── ViewSwitch.tsx      # Switch entre visualizações
├── utils/
│   └── solarCalculations.ts # Cálculos astronômicos
├── assets/
│   └── textures.ts         # URLs das texturas
├── App.tsx                 # Componente principal
└── App.css                # Estilos globais
```

## 🧮 Cálculos Astronômicos

### Declinação Solar
A declinação solar varia ao longo do ano devido à inclinação axial da Terra (23.45°):

```typescript
function calculateSolarDeclination(date: Date): number {
  const dayOfYear = getDayOfYear(date);
  return 23.45 * Math.sin((360 * (284 + dayOfYear) / 365) * Math.PI / 180);
}
```

### Equação do Tempo
Corrige a diferença entre o tempo solar aparente e o tempo solar médio:

```typescript
function calculateEquationOfTime(date: Date): number {
  const dayOfYear = getDayOfYear(date);
  const B = (360 / 365) * (dayOfYear - 81) * Math.PI / 180;
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}
```

### Ponto Subsolar
Calcula onde o Sol está no zênite em um momento específico:

```typescript
function calculateSubsolarPoint(date: Date): { lat: number; lng: number } {
  const declination = calculateSolarDeclination(date);
  const longitude = calculateSolarNoonLongitude(date);
  return { lat: declination, lng: longitude };
}
```

## 🌍 Visualização 3D

### Conversão de Coordenadas
Converte latitude/longitude para coordenadas cartesianas 3D:

```typescript
function latLngToVector3(lat: number, lng: number, radius: number = 1): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return new THREE.Vector3(x, y, z);
}
```

### Carregamento de Texturas
Utiliza React Suspense para carregamento progressivo:

```typescript
<Suspense fallback={<EarthFallback />}>
  <EarthWithTexture />
</Suspense>
```

## 🗺️ Projeção Mercator

### Transformação de Coordenadas
Converte latitude/longitude para coordenadas Mercator:

```typescript
function latToMercatorY(lat: number): number {
  const latRad = (lat * Math.PI) / 180;
  return Math.log(Math.tan(Math.PI / 4 + latRad / 2));
}

function lngToMercatorX(lng: number): number {
  return (lng * Math.PI) / 180;
}
```

### Renderização SVG
Utiliza SVG para renderização eficiente da projeção plana:

```xml
<svg width="800" height="400" viewBox="0 0 800 400">
  <polyline points={zenithLinePoints} stroke="red" strokeWidth="3" />
  <circle cx={subsolarPoint.x} cy={subsolarPoint.y} r="8" fill="yellow" />
</svg>
```

## 🎨 Estilização e UX

### Design System
- **Cores primárias**: Gradiente azul (#1e3c72 → #2a5298)
- **Acentos**: Azul claro (#4fc3f7), Vermelho (#ff6b6b), Amarelo (#ffff00)
- **Tipografia**: Segoe UI, sistema nativo
- **Efeitos**: Backdrop-filter, box-shadow, transitions

### Responsividade
- **Desktop**: Layout lado a lado (globo + controles)
- **Tablet**: Layout flexível com wrap
- **Mobile**: Layout vertical, componentes empilhados

### Acessibilidade
- **Contraste**: Cores com contraste adequado
- **Labels**: Elementos de formulário rotulados
- **Keyboard**: Navegação por teclado
- **Screen readers**: Estrutura semântica

## ⚡ Performance

### Otimizações 3D
- **LOD (Level of Detail)**: Menos detalhes em objetos distantes
- **Frustum Culling**: Não renderiza objetos fora da câmera
- **Texture Compression**: Texturas otimizadas
- **Batching**: Agrupa geometrias similares

### Lazy Loading
- **Suspense**: Carregamento progressivo de componentes
- **Dynamic Imports**: Separação de código
- **Texture Fallbacks**: Versão simplificada enquanto carrega

### Bundle Optimization
- **Tree Shaking**: Remove código não utilizado
- **Code Splitting**: Divide em chunks menores
- **Compression**: Gzip e Brotli habilitados

## 🚀 Deploy e CI/CD

### Vercel Configuration
```json
{
  "version": 2,
  "builds": [{"src": "package.json", "use": "@vercel/static-build"}],
  "routes": [{"src": "/(.*)", "dest": "/index.html"}]
}
```

### Environment Variables
```bash
GENERATE_SOURCEMAP=false
REACT_APP_NAME=Zênite Solar
REACT_APP_VERSION=$npm_package_version
```

### Build Scripts
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "serve": "serve -s build -p 3001"
  }
}
```

## 🧪 Testes e Qualidade

### Estrutura de Testes
- **Unit Tests**: Componentes individuais
- **Integration Tests**: Fluxos completos
- **E2E Tests**: Cenários de usuário
- **Visual Regression**: Mudanças visuais

### Code Quality
- **TypeScript**: Tipagem estática
- **ESLint**: Linting de código
- **Prettier**: Formatação consistente
- **Husky**: Git hooks para qualidade

## 📊 Monitoramento

### Métricas de Performance
- **Core Web Vitals**: LCP, FID, CLS
- **Bundle Size**: Tamanho dos arquivos
- **Load Time**: Tempo de carregamento
- **Memory Usage**: Uso de memória

### Error Tracking
- **Error Boundaries**: Captura de erros React
- **Console Monitoring**: Logs estruturados
- **User Feedback**: Sistema de relatórios

## 🔧 Troubleshooting

### Problemas Comuns

1. **Texturas não carregam**
   - Verificar CORS policy
   - Usar fallback estático
   - Cache do navegador

2. **Performance baixa no 3D**
   - Reduzir qualidade das texturas
   - Diminuir detalhes de geometria
   - Limitar FPS

3. **Build falha**
   - Verificar dependências
   - Limpar cache do npm
   - Checar versões Node.js

### Debug
```bash
# Modo debug
npm start -- --verbose

# Análise do bundle
npm run build && npx serve -s build

# Profiling
npm install --save-dev webpack-bundle-analyzer
```

## 📈 Roadmap Futuro

### Funcionalidades Planejadas
- [ ] Animação temporal (time-lapse)
- [ ] Múltiplos pontos solares simultâneos
- [ ] Exportação de dados (CSV, JSON)
- [ ] API para integração externa
- [ ] Realidade aumentada (AR)
- [ ] Modo offline (PWA)

### Melhorias Técnicas
- [ ] WebGL2 para melhor performance
- [ ] Workers para cálculos pesados
- [ ] Streaming de texturas
- [ ] Cache inteligente
- [ ] Acessibilidade avançada

---

Desenvolvido com ❤️ para educação científica e divulgação astronômica.
