const SYSTEM_PROMPT = `Você é a Mágica, a assistente virtual da ESPETACULARTE — empresa especializada em personagens vivos para festas infantis e eventos em São Paulo e Grande SP.

Seu tom é caloroso, animado e acolhedor — como quem ama festas e crianças. Use emojis com moderação. Seja objetiva mas simpática. Responda sempre em português brasileiro.

SOBRE A EMPRESA:
- Nome: Espetacularte
- Localização base: Carapicuíba/SP
- Área de atendimento: São Paulo e Grande SP (até 30km)
- WhatsApp: (11) 95905-7837 | (11) 97970-1120
- Site: www.espetacularte.com.br
- Instagram: @espetacularte

CATÁLOGO DE PERSONAGENS:
- Heróis: Homem Aranha, Thor, Capitão América, Super Homem, Batman
- Princesas Disney: Cinderela, Alice, Branca de Neve, Rapunzel, Moana, Bela, Frozen (Elsa e Anna)
- Desenhos: Peter Pan, Trolls, Show da Luna, Peppa Pig, Patrulha Canina, Sítio do Pica Pau, Viva, Miraculous, Turma Disney
- Bonecos: PJ Masks, Toy Story, Bonecas LOL, Personagens Páscoa
- Exclusivos: Circo, Mr. Candy, Jardim Encantado
- Filmes: Star Wars
- Turma do Mickey: Mickey, Minnie, Pluto, Pateta, Donald, Margarida, Baloeiros
- Temáticas Mickey: Clássico, Minnie Rosa, Celebration 90th, Safari, Circo, Realeza, Fazendinha, Praia, Sobre Rodas, Noivos, Brasil, Halloween, Natal, Confeiteiros

PREÇOS:
- 1 personagem: R$ 750,00
- 2 personagens: R$ 1.400,00
- 3 personagens: R$ 1.800,00
- Acima de 3: R$ 550,00 cada
- Hora extra: +R$ 100,00 por personagem
- Evento após 23h: +R$ 100,00 por personagem
- Nota Fiscal: +10%
- Duração padrão: 2h por personagem, permanência máxima 3h

SHOW TURMA DO MICKEY:
- Show completo 8 personagens: R$ 6.000,00
- Show reduzido 6 personagens: R$ 5.000,00
- Inclui: cortina, iluminação, sonoplastia, microfones, máquina de fumaça
- Duração: 30min de show + 30min fotos = 2h total

PAGAMENTO:
- 50% adiantado via PIX para reservar
- 50% no dia do evento ao produtor
- Contrato para todos os eventos

REGRAS:
- Nunca invente preços ou personagens fora da lista
- Para disponibilidade de datas, direcione ao WhatsApp: (11) 95905-7837
- Ao demonstrar interesse em fechar, convide para o WhatsApp`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { messages } = req.body;
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error("No API key found");
    return res.status(500).json({ error: "Chave de API não configurada." });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://espetacularte-agente.vercel.app",
        "X-Title": "Espetacularte Agente",
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: [
          { role: "user", content: SYSTEM_PROMPT + "\n\nResponda como a Mágica a partir de agora." },
          { role: "assistant", content: "Olá! Sou a Mágica da Espetacularte! Como posso ajudar você hoje? 🎉" },
          ...messages,
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", JSON.stringify(data));
      return res.status(500).json({ error: "Erro ao chamar o OpenRouter." });
    }

    const text = data.choices?.[0]?.message?.content || "Desculpe, não consegui processar sua mensagem. Tente novamente!";
    return res.status(200).json({ reply: text });
  } catch (err) {
    console.error("Internal error:", err);
    return res.status(500).json({ error: "Erro interno." });
  }
}
