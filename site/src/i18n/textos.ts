// Textos do site em espanhol (principal) e português.
// Os números vêm da proposta comercial e dos protótipos; preços são os do piloto de Valência.
export type Lang = 'es' | 'pt';
const NB = ' ';

export const LINKS = {
  prototipos: 'https://dropp-liquid-exp.vercel.app/prototipos/',
  prototipo: (slug: string) => `https://dropp-liquid-exp.vercel.app/prototipos/ver.html?p=${slug}`,
  app: 'https://dropp-liquid-exp.vercel.app/'
};

export const ROTAS: Record<string, Record<Lang, string>> = {
  inicio: { es: '/', pt: '/pt/' },
  solucoes: { es: '/soluciones/', pt: '/pt/solucoes/' },
  escola: { es: '/escuela/', pt: '/pt/escola/' },
  precos: { es: '/precios/', pt: '/pt/precos/' },
  sobre: { es: '/sobre/', pt: '/pt/sobre/' },
  contato: { es: '/contacto/', pt: '/pt/contato/' }
};

export const T = {
  es: {
    lang: 'es-ES',
    nav: { solucoes: 'Soluciones', escola: 'Escuela', precos: 'Precios', sobre: 'Sobre DROPP', contato: 'Contacto', probar: 'Probar los prototipos', menu: 'Menú', outra: 'Português', outraLang: 'pt' },
    rodape: {
      ficticio: 'Las personas, los bares y los números de las pantallas son ficticios y sirven de ejemplo.',
      piloto: 'Piloto en Valencia, de febrero a abril de 2027.',
      prototipos: 'Prototipos navegables'
    },
    inicio: {
      meta: 'DROPP Liquid Experience: el cuaderno de trabajo del bartender. Fichas, lotes con etiqueta, el turno y el Pasaporte del Oficio.',
      titulo: 'El cuaderno de trabajo del bartender.',
      lide: 'Fichas con su coste, lotes con etiqueta, el turno de cada noche y tu Pasaporte del Oficio. Todo en un sitio que va contigo de bar en bar.',
      cta1: 'Probar los prototipos', cta2: 'Hablar con nosotros',
      areasTit: 'Cuatro áreas y nada más',
      areasLide: 'Lo que se usa en la barra, sin menús de más.',
      areas: [
        { id: 'turno', nome: 'Turno', texto: 'Antes del servicio, el Barback deja hasta tres recados, cada uno con la cuenta a la vista. Durante el servicio, solo voz.' },
        { id: 'lote', nome: 'Cuaderno', texto: 'Lotes con caducidad, alérgenos y QR en la etiqueta. Fichas con el coste de cada dosis y cuentas con la fórmula a la vista.' },
        { id: 'passaporte', nome: 'Pasaporte del Oficio', texto: 'Tu oficio en sellos firmados: fecha, lugar y quién lo vio. Ninguna nota, ningún ranking. Va contigo si cambias de casa.' },
        { id: 'atlas', nome: 'Atlas', texto: 'Técnicas en el idioma del turno, los clásicos con su receta original y la agenda del sector.' }
      ],
      barbackTit: 'El Barback',
      barbackLide: 'La base de datos calcula, la IA explica y tú decides.',
      barback: [
        { t: 'Lee lo que la casa ya registra', d: 'Fichas, lotes, reservas, ventas del TPV y las notas de voz del cierre. Nadie teclea nada nuevo.' },
        { t: 'Elige como máximo tres cosas', d: 'Lo que cambia la noche: lo que cuesta dinero, lo que saca un cóctel de la carta, lo que pone a alguien en riesgo.' },
        { t: 'Dice de dónde sale cada número', d: 'Cada recado trae la cuenta y la fuente. Sin ficha, no hay respuesta.' },
        { t: 'No decide por ti', d: 'Un precio, una invitación o un mensaje nunca salen sin tu ok.' }
      ],
      escolaTit: 'La Escuela DROPP',
      escolaTexto: 'La comunidad de pago para quien vive de la barra. Cursos en grupo con fecha, práctica evaluada en un bar y el sello Escuela en tu Pasaporte. Cada curso tiene su mural, y cada mes hay una crítica escrita y una clase en directo.',
      escolaPreco: `Socio DROPP: 9,99${NB}€ al mes, con 30 días gratis.`,
      escolaCta: 'Conocer la Escuela',
      casaTit: 'Para la casa',
      casaTexto: 'Las fichas de la casa para todo el equipo, la comprobación de la barra con QR, la formación de quien llega y el Barback en operación, finanzas y marketing.',
      casaPreco: `Plan Casa: 29${NB}€ al mes por local, con el Socio para 2 personas del equipo.`,
      casaCta: 'Ver soluciones',
      naoTit: 'Lo que no hacemos',
      nao: [
        'No ponemos nota a personas. La prueba es un sello firmado.',
        'No cobramos por la prueba: Pasaporte y sellos son siempre gratis.',
        'No escondemos la seguridad: alérgenos y caducidad nunca van detrás de un pago.',
        'No ponemos anuncios ni vendemos tus datos.',
        'No mandamos recados durante el servicio.'
      ],
      fimTit: 'Buscamos bares, escuelas y bartenders para el piloto de Valencia.',
      fimCta: 'Escríbenos'
    },
    solucoes: {
      meta: 'Soluciones de DROPP para bartenders, bares, marcas y escuelas de coctelería.',
      titulo: 'Soluciones',
      lide: 'Cada uno paga por una cosa distinta, y nadie paga por una prueba.',
      blocos: [
        { id: 'bartender', tela: 'turno', titulo: 'Para bartenders', itens: [
          'Gratis, sin plazo: la agenda del Turno, el Cuaderno con hasta 50 fichas, lotes, etiquetas con QR y alérgenos, las cuatro cuentas, el Pasaporte entero y el Atlas.',
          'Socio DROPP: la Escuela, fichas sin límite, historial de coste y exportación en PDF.',
          'Socio con Barback: además, un Barback que trabaja para ti y va contigo de casa en casa: rutina, ingresos, eventos por tu cuenta, itinerario de estudio y carrera.'
        ] },
        { id: 'casa', tela: 'lote', titulo: 'Para bares', itens: [
          'El Barback de la casa en operación, finanzas y marketing, con el nivel de autonomía que elijas.',
          'Fichas de la casa para todo el equipo, comprobación de la barra con QR, lotes y etiquetas del equipo.',
          'Formación de quien llega, el sello Casa-escuela y el Socio para 2 personas del equipo.',
          `Plan Casa: 29${NB}€ al mes por local, sin IVA; cada socio de más, 6${NB}€ al mes.`
        ] },
        { id: 'marcas', tela: 'escola', titulo: 'Para marcas', itens: [
          'Un curso patrocinado en la Escuela, abierto a todos, con «Pagado por» a la vista y acceso solo para mayores de 18.',
          'El curso se evalúa igual que los demás. La marca no firma sellos.',
          'Presupuesto por curso producido.'
        ] },
        { id: 'escolas', tela: 'passaporte', titulo: 'Para escuelas de coctelería', itens: [
          'Tus alumnos salen del curso con el Pasaporte abierto y su primera ficha.',
          'Las prácticas se registran como sellos firmados, con fecha, lugar y quién las vio.'
        ] }
      ]
    },
    escola: {
      meta: 'La Escuela DROPP: cursos en grupo con fecha, práctica evaluada en un bar y el sello Escuela en el Pasaporte del Oficio.',
      titulo: 'La Escuela DROPP',
      lide: 'Cursos en grupo, con fecha, práctica en la barra y un sello firmado al final. Para estudiar sin dejar de trabajar.',
      comoTit: 'Cómo funciona',
      como: [
        { t: 'Cursos con fecha, no catálogo', d: 'Cada curso tiene inicio, encuentros en la agenda y plazas.' },
        { t: 'La clase es un ejercicio con tu ficha', d: 'Cambias el hielo y el tiempo hasta que el agua llega a lo que pide la ficha. Nada de masterclass de tres horas.' },
        { t: 'La práctica es presencial', d: 'En un bar, con dos firmas: la de quien enseña y la de un colega.' },
        { t: 'El certificado es el sello', d: 'Al terminar, el sello Escuela entra en tu Pasaporte. Nada de PDF suelto.' }
      ],
      comunidadeTit: 'La comunidad',
      comunidade: [
        { t: 'Un mural por curso', d: 'Moderado por quien enseña, para dudas, fotos y fichas. Sin likes que hagan ranking.' },
        { t: 'Una crítica al mes', d: 'Mandas foto y ficha de un cóctel y recibes una crítica escrita.' },
        { t: 'Una clase en directo al mes', d: 'Con fecha en la agenda, para todos los socios.' },
        { t: 'Una biblioteca que ordenas tú', d: 'Monografías, fichas técnicas y procedimientos, en tu propio estante.' }
      ],
      quemTit: 'Quién enseña',
      quem: 'Bartenders con grado Reserva en ese oficio, pagados por DROPP por curso. Los cursos patrocinados siguen la misma evaluación.',
      planosTit: 'Planes',
      planos: [
        { nome: 'Socio DROPP', preco: `9,99${NB}€ al mes`, alt: `o 99${NB}€ al año, IVA incluido`, itens: ['30 días gratis', 'Cursos en grupo y sello Escuela', 'Mural del curso, crítica mensual y clase en directo', 'Fichas sin límite y exportación en PDF'] },
        { nome: 'Socio con Barback', preco: `19,99${NB}€ al mes`, alt: `o 199${NB}€ al año, IVA incluido`, itens: ['Todo lo del Socio', 'Un Barback que trabaja para ti', 'Rutina, ingresos y eventos por tu cuenta', 'Itinerario de estudio a partir de tu Pasaporte'] },
        { nome: 'Práctica suelta', preco: `39${NB}€`, alt: 'por curso, sin ser socio', itens: ['Solo la práctica presencial', 'Con las mismas dos firmas', 'Bizum o tarjeta'] }
      ],
      regrasTit: 'Reglas claras',
      regras: ['Te avisamos 15 días antes de cada cobro.', 'Cancelas con un toque, sin multa.', 'Antes de empezar te explicamos el desistimiento de 14 días.'],
      cta: 'Ver la Escuela en el prototipo'
    },
    precos: {
      meta: 'Precios del piloto de DROPP en Valencia: gratis para el día a día, Socio DROPP, Socio con Barback y Plan Casa.',
      titulo: 'Precios',
      lide: 'Lo del día a día y la prueba son gratis. Se paga por profundidad y por gente.',
      nota: 'Precios del piloto de Valencia, 2027. Pueden cambiar después del piloto.',
      cab: ['Plan', 'Qué incluye', 'Precio'],
      linhas: [
        ['Gratis', 'Agenda del Turno; Cuaderno con hasta 50 fichas, lotes, etiquetas con QR y alérgenos y las cuatro cuentas; el Pasaporte entero; el Atlas', `0${NB}€, sin plazo`],
        ['Socio DROPP', 'La Escuela: cursos en grupo con práctica y sello, mural del curso, crítica mensual, clase en directo, biblioteca; fichas sin límite, historial de coste y PDF', `9,99${NB}€ al mes o 99${NB}€ al año, IVA incluido; 30 días gratis`],
        ['Socio con Barback', 'Todo lo del Socio y el Barback personal: rutina, ingresos, eventos por tu cuenta, itinerario de estudio y carrera', `19,99${NB}€ al mes o 199${NB}€ al año, IVA incluido`],
        ['Plan Casa', 'Barback de la casa, fichas para el equipo, comprobación de la barra, formación, sello Casa-escuela y el Socio para 2 personas', `29${NB}€ al mes por local, sin IVA; cada socio de más, 6${NB}€`],
        ['Práctica suelta', 'Una práctica presencial de la Escuela, sin ser socio', `39${NB}€`],
        ['Marcas', 'Un curso patrocinado, con «Pagado por» y solo para mayores de 18', 'Presupuesto por curso']
      ]
    },
    sobre: {
      meta: 'Sobre DROPP Liquid Experience: la plataforma de trabajo del bartender, del bar primero.',
      titulo: 'Sobre DROPP',
      lide: 'DROPP Liquid Experience es la plataforma de trabajo del bartender: lo que hace en la barra, guardado y probado, y que va con él de casa en casa.',
      principiosTit: 'Lo que creemos',
      principios: [
        { t: 'El bar primero', d: 'En la etiqueta, en el sello y en la pantalla, el bar va delante y DROPP detrás.' },
        { t: 'Medidas, no notas', d: 'Ningún número compara personas. Se cuentan años, casas, fichas y gente formada.' },
        { t: 'La prueba es un sello firmado', d: 'Cada sello tiene fecha, lugar y quién lo vio. Nadie sella su propio pasaporte.' },
        { t: 'La base de datos calcula, la IA explica', d: 'Ningún número es inventado, y ninguna decisión sale sin una persona.' },
        { t: 'Lo tuyo va contigo', d: 'Si cambias de casa, te llevas el Pasaporte, tus fichas personales y tu Barback. La casa se queda con sus fichas y sus lotes.' }
      ],
      ondeTit: 'Dónde empezamos',
      onde: 'En Valencia, entre febrero y abril de 2027, con bares, escuelas y la asociación de bartenders de la ciudad. Madrid y Barcelona vienen después, si el piloto cumple sus metas.'
    },
    contato: {
      meta: 'Contacto con DROPP Liquid Experience.',
      titulo: 'Contacto',
      lide: 'Escríbenos si tienes un bar, das clases, representas una marca o quieres probar DROPP en Valencia.',
      nome: 'Nombre', email: 'Correo', perfil: 'Soy', perfis: ['Bartender', 'Bar o restaurante', 'Escuela de coctelería', 'Marca', 'Otro'], mensagem: 'Mensaje',
      enviar: 'Enviar', assunto: 'Contacto desde la web de DROPP',
      pendente: 'El formulario abre tu correo con el mensaje listo.'
    }
  },
  pt: {
    lang: 'pt-BR',
    nav: { solucoes: 'Soluções', escola: 'Escola', precos: 'Preços', sobre: 'Sobre a DROPP', contato: 'Contato', probar: 'Testar os protótipos', menu: 'Menu', outra: 'Español', outraLang: 'es' },
    rodape: {
      ficticio: 'Pessoas, bares e números das telas são fictícios e servem de exemplo.',
      piloto: 'Piloto em Valência, de fevereiro a abril de 2027.',
      prototipos: 'Protótipos navegáveis'
    },
    inicio: {
      meta: 'DROPP Liquid Experience: o caderno de trabalho do bartender. Fichas, lotes com etiqueta, o turno e o Passaporte do Ofício.',
      titulo: 'O caderno de trabalho do bartender.',
      lide: 'Fichas com o custo, lotes com etiqueta, o turno de cada noite e o seu Passaporte do Ofício. Tudo num lugar que vai com você de bar em bar.',
      cta1: 'Testar os protótipos', cta2: 'Falar com a gente',
      areasTit: 'Quatro áreas e nada mais',
      areasLide: 'O que se usa no balcão, sem menu sobrando.',
      areas: [
        { id: 'turno', nome: 'Turno', texto: 'Antes do serviço, o Barback deixa até três recados, cada um com a conta à vista. Durante o serviço, só voz.' },
        { id: 'lote', nome: 'Caderno', texto: 'Lotes com validade, alérgenos e QR na etiqueta. Fichas com o custo de cada dose e contas com a fórmula à vista.' },
        { id: 'passaporte', nome: 'Passaporte do Ofício', texto: 'O seu ofício em carimbos assinados: data, lugar e quem viu. Nenhuma nota, nenhum ranking. Vai com você se mudar de casa.' },
        { id: 'atlas', nome: 'Atlas', texto: 'Técnicas na língua do turno, os clássicos com a receita original e a agenda do setor.' }
      ],
      barbackTit: 'O Barback',
      barbackLide: 'O banco calcula, a IA explica e você decide.',
      barback: [
        { t: 'Lê o que a casa já registra', d: 'Fichas, lotes, reservas, vendas do PDV e as notas de voz do fechamento. Ninguém digita nada novo.' },
        { t: 'Escolhe no máximo três coisas', d: 'O que muda a noite: o que custa dinheiro, o que tira um drink da carta, o que põe alguém em risco.' },
        { t: 'Diz de onde vem cada número', d: 'Cada recado traz a conta e a fonte. Sem ficha, sem resposta.' },
        { t: 'Não decide por você', d: 'Preço, convite ou mensagem nunca saem sem o seu ok.' }
      ],
      escolaTit: 'A Escola DROPP',
      escolaTexto: 'A comunidade paga para quem vive do balcão. Turmas com data, prática avaliada num bar e o carimbo Escola no seu Passaporte. Cada turma tem o seu mural, e todo mês há uma crítica escrita e uma aula ao vivo.',
      escolaPreco: 'Sócio DROPP: €9,99 por mês, com 30 dias grátis.',
      escolaCta: 'Conhecer a Escola',
      casaTit: 'Para a casa',
      casaTexto: 'As fichas da casa para o time inteiro, a conferência da bancada com QR, o treino de quem chega e o Barback em operação, financeiro e marketing.',
      casaPreco: 'Plano Casa: €29 por mês por local, com o Sócio para 2 pessoas do time.',
      casaCta: 'Ver soluções',
      naoTit: 'O que a gente não faz',
      nao: [
        'Não dá nota a pessoas. A prova é um carimbo assinado.',
        'Não cobra pela prova: Passaporte e carimbos são sempre grátis.',
        'Não esconde a segurança: alérgenos e validade nunca ficam atrás de pagamento.',
        'Não põe anúncio nem vende os seus dados.',
        'Não manda recado durante o serviço.'
      ],
      fimTit: 'Procuramos bares, escolas e bartenders para o piloto de Valência.',
      fimCta: 'Escreva para a gente'
    },
    solucoes: {
      meta: 'Soluções da DROPP para bartenders, bares, marcas e escolas de coquetelaria.',
      titulo: 'Soluções',
      lide: 'Cada um paga por uma coisa diferente, e ninguém paga por uma prova.',
      blocos: [
        { id: 'bartender', tela: 'turno', titulo: 'Para bartenders', itens: [
          'Grátis, sem prazo: a agenda do Turno, o Caderno com até 50 fichas, lotes, etiquetas com QR e alérgenos, as quatro contas, o Passaporte inteiro e o Atlas.',
          'Sócio DROPP: a Escola, fichas sem limite, histórico de custo e exportação em PDF.',
          'Sócio com Barback: além disso, um Barback que trabalha para você e vai junto de casa em casa: rotina, renda, eventos solo, trilhas de estudo e carreira.'
        ] },
        { id: 'casa', tela: 'lote', titulo: 'Para bares', itens: [
          'O Barback da casa em operação, financeiro e marketing, com o nível de autonomia que você escolher.',
          'Fichas da casa para o time inteiro, conferência da bancada com QR, lotes e etiquetas da equipe.',
          'Treino de quem chega, o selo Casa-escola e o Sócio para 2 pessoas do time.',
          'Plano Casa: €29 por mês por local, sem IVA; cada sócio a mais, €6 por mês.'
        ] },
        { id: 'marcas', tela: 'escola', titulo: 'Para marcas', itens: [
          'Um curso patrocinado na Escola, aberto a todos, com "Pago por" à vista e acesso só para maiores de 18.',
          'O curso é avaliado como os outros. A marca não assina carimbo.',
          'Orçamento por curso produzido.'
        ] },
        { id: 'escolas', tela: 'passaporte', titulo: 'Para escolas de coquetelaria', itens: [
          'Os seus alunos saem do curso com o Passaporte aberto e a primeira ficha.',
          'As práticas viram carimbos assinados, com data, lugar e quem viu.'
        ] }
      ]
    },
    escola: {
      meta: 'A Escola DROPP: turmas com data, prática avaliada num bar e o carimbo Escola no Passaporte do Ofício.',
      titulo: 'A Escola DROPP',
      lide: 'Turmas com data, prática no balcão e um carimbo assinado no fim. Para estudar sem parar de trabalhar.',
      comoTit: 'Como funciona',
      como: [
        { t: 'Turma com data, não catálogo', d: 'Cada turma tem início, encontros na agenda e vagas.' },
        { t: 'A aula é um exercício com a sua ficha', d: 'Você troca o gelo e o tempo até a água chegar ao que a ficha pede. Nada de masterclass de três horas.' },
        { t: 'A prática é presencial', d: 'Num bar, com duas assinaturas: a de quem ensina e a de um colega.' },
        { t: 'O certificado é o carimbo', d: 'No fim, o carimbo Escola entra no seu Passaporte. Nada de PDF solto.' }
      ],
      comunidadeTit: 'A comunidade',
      comunidade: [
        { t: 'Um mural por turma', d: 'Moderado por quem ensina, para dúvidas, fotos e fichas. Sem curtida que vira ranking.' },
        { t: 'Uma crítica por mês', d: 'Você manda foto e ficha de um drink e recebe uma crítica escrita.' },
        { t: 'Uma aula ao vivo por mês', d: 'Com data na agenda, para todos os sócios.' },
        { t: 'Uma biblioteca que você organiza', d: 'Monografias, fichas técnicas e procedimentos, na sua própria estante.' }
      ],
      quemTit: 'Quem ensina',
      quem: 'Bartenders com grau Reserva naquele ofício, pagos pela DROPP por turma. Os cursos patrocinados seguem a mesma avaliação.',
      planosTit: 'Planos',
      planos: [
        { nome: 'Sócio DROPP', preco: '€9,99 por mês', alt: 'ou €99 por ano, IVA incluído', itens: ['30 dias grátis', 'Turmas e carimbo Escola', 'Mural da turma, crítica mensal e aula ao vivo', 'Fichas sem limite e exportação em PDF'] },
        { nome: 'Sócio com Barback', preco: '€19,99 por mês', alt: 'ou €199 por ano, IVA incluído', itens: ['Tudo do Sócio', 'Um Barback que trabalha para você', 'Rotina, renda e eventos solo', 'Trilha de estudo a partir do seu Passaporte'] },
        { nome: 'Prática avulsa', preco: '€39', alt: 'por turma, sem ser sócio', itens: ['Só a prática presencial', 'Com as mesmas duas assinaturas', 'Bizum ou cartão'] }
      ],
      regrasTit: 'Regras claras',
      regras: ['A gente avisa 15 dias antes de cada cobrança.', 'Você cancela com um toque, sem multa.', 'Antes de começar, explicamos a desistência de 14 dias.'],
      cta: 'Ver a Escola no protótipo'
    },
    precos: {
      meta: 'Preços do piloto da DROPP em Valência: grátis para o dia a dia, Sócio DROPP, Sócio com Barback e Plano Casa.',
      titulo: 'Preços',
      lide: 'O dia a dia e a prova são grátis. Paga-se por profundidade e por gente.',
      nota: 'Preços do piloto de Valência, 2027. Podem mudar depois do piloto.',
      cab: ['Plano', 'O que inclui', 'Preço'],
      linhas: [
        ['Grátis', 'Agenda do Turno; Caderno com até 50 fichas, lotes, etiquetas com QR e alérgenos e as quatro contas; o Passaporte inteiro; o Atlas', '€0, sem prazo'],
        ['Sócio DROPP', 'A Escola: turmas com prática e carimbo, mural da turma, crítica mensal, aula ao vivo, biblioteca; fichas sem limite, histórico de custo e PDF', '€9,99 por mês ou €99 por ano, IVA incluído; 30 dias grátis'],
        ['Sócio com Barback', 'Tudo do Sócio e o Barback pessoal: rotina, renda, eventos solo, trilhas de estudo e carreira', '€19,99 por mês ou €199 por ano, IVA incluído'],
        ['Plano Casa', 'Barback da casa, fichas para o time, conferência da bancada, treino, selo Casa-escola e o Sócio para 2 pessoas', '€29 por mês por local, sem IVA; cada sócio a mais, €6'],
        ['Prática avulsa', 'Uma prática presencial da Escola, sem ser sócio', '€39'],
        ['Marcas', 'Um curso patrocinado, com "Pago por" e só para maiores de 18', 'Orçamento por curso']
      ]
    },
    sobre: {
      meta: 'Sobre a DROPP Liquid Experience: a plataforma de trabalho do bartender, com o bar primeiro.',
      titulo: 'Sobre a DROPP',
      lide: 'A DROPP Liquid Experience é a plataforma de trabalho do bartender: o que ele faz no balcão, guardado e provado, e que vai com ele de casa em casa.',
      principiosTit: 'No que a gente acredita',
      principios: [
        { t: 'O bar primeiro', d: 'Na etiqueta, no carimbo e na tela, o bar vem na frente e a DROPP depois.' },
        { t: 'Medidas, não notas', d: 'Nenhum número compara pessoas. Contam-se anos, casas, fichas e gente formada.' },
        { t: 'A prova é um carimbo assinado', d: 'Todo carimbo tem data, lugar e quem viu. Ninguém carimba o próprio passaporte.' },
        { t: 'O banco calcula, a IA explica', d: 'Nenhum número é inventado, e nenhuma decisão sai sem uma pessoa.' },
        { t: 'O que é seu vai com você', d: 'Se mudar de casa, você leva o Passaporte, as fichas pessoais e o seu Barback. A casa fica com as fichas e os lotes dela.' }
      ],
      ondeTit: 'Onde a gente começa',
      onde: 'Em Valência, entre fevereiro e abril de 2027, com bares, escolas e a associação de bartenders da cidade. Madri e Barcelona vêm depois, se o piloto bater as metas.'
    },
    contato: {
      meta: 'Contato com a DROPP Liquid Experience.',
      titulo: 'Contato',
      lide: 'Escreva para a gente se você tem um bar, dá aulas, representa uma marca ou quer testar a DROPP em Valência.',
      nome: 'Nome', email: 'E-mail', perfil: 'Eu sou', perfis: ['Bartender', 'Bar ou restaurante', 'Escola de coquetelaria', 'Marca', 'Outro'], mensagem: 'Mensagem',
      enviar: 'Enviar', assunto: 'Contato pelo site da DROPP',
      pendente: 'O formulário abre o seu e-mail com a mensagem pronta.'
    }
  }
} as const;

export type Textos = (typeof T)[Lang];
