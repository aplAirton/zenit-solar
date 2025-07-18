# Zênite Solar

Uma aplicação web interativa que visualiza onde o Sol passa exatamente no zênite (90°) em qualquer dia do ano.

## 🌍 Sobre o Projeto

Esta aplicação mostra a linha de zênite solar no globo terrestre, calculando matematicamente onde o Sol está diretamente acima (a 90 graus) para qualquer data e hora selecionada. É uma ferramenta educativa perfeita para entender:

- **Declinação Solar**: Como a posição do Sol varia ao longo do ano
- **Equação do Tempo**: A diferença entre o tempo solar aparente e médio
- **Ponto Subsolar**: Onde o Sol está exatamente no zênite em um momento específico
- **Estações do Ano**: Como elas se relacionam com a posição solar

## ✨ Funcionalidades

- 🌐 **Visualização 3D interativa** do globo terrestre com Three.js
- 📅 **Seletor de data e hora** para explorar qualquer momento
- 🔴 **Linha de zênite** mostrada em vermelho no globo
- 🟡 **Ponto subsolar** em tempo real
- 📊 **Informações detalhadas** sobre cálculos solares
- 📱 **Design responsivo** para todos os dispositivos
- 🌍 **Navegação intuitiva** com controles de órbita

## 🚀 Tecnologias Utilizadas

- **React 18** com TypeScript
- **Three.js** e **@react-three/fiber** para visualização 3D
- **@react-three/drei** para componentes 3D prontos
- **date-fns** para manipulação de datas
- **CSS Moderno** com gradientes e backdrop-filter
- **Vercel** para deploy automático

## 📐 Cálculos Astronômicos

A aplicação implementa fórmulas astronômicas precisas para:

### Declinação Solar
```
δ = 23.45° × sin(360° × (284 + n) / 365)
```
Onde `n` é o dia do ano.

### Equação do Tempo
```
E = 9.87 × sin(2B) - 7.53 × cos(B) - 1.5 × sin(B)
B = (360°/365) × (n - 81)
```

### Ponto Subsolar
O ponto onde o Sol está no zênite é calculado combinando:
- Latitude = Declinação solar
- Longitude = Função do tempo e equação do tempo

## 🛠️ Instalação e Desenvolvimento

### Pré-requisitos
- Node.js 16+
- npm ou yarn

### Passos para rodar localmente

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/zenit-solar.git
cd zenit-solar
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute o servidor de desenvolvimento**
```bash
npm start
```

4. **Abra no navegador**
```
http://localhost:3000
```

### Build para produção
```bash
npm run build
```

## 🌐 Deploy na Vercel

Este projeto está configurado para deploy automático na Vercel:

1. Conecte seu repositório à Vercel
2. A Vercel detectará automaticamente as configurações
3. O deploy será feito automaticamente a cada push

## 📚 Como Usar

1. **Selecione uma data**: Use o controle de data para escolher qualquer dia
2. **Ajuste a hora**: Modifique a hora para ver como o ponto subsolar se move
3. **Explore o globo**: Use o mouse para rotacionar, aproximar e navegar
4. **Observe a linha vermelha**: Esta é a linha de zênite para o dia selecionado
5. **Veja o ponto amarelo**: Este é onde o Sol está no zênite no momento exato

## 🎯 Casos de Uso Educativos

- **Geografia**: Entender as estações e zonas climáticas
- **Astronomia**: Visualizar movimentos solares
- **Física**: Compreender ângulos solares e irradiação
- **Matemática**: Ver aplicações práticas de trigonometria

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:

- Reportar bugs
- Sugerir melhorias
- Adicionar novas funcionalidades
- Melhorar a documentação

## 📄 Licença

Este projeto está sob a licença MIT.

---

Feito com ❤️ para educação e divulgação científica.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
