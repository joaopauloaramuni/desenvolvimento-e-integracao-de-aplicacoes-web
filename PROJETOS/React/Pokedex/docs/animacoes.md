# Animações dos Pokémon (Higgsfield)

A tela de detalhes mostra, nesta ordem, o que estiver disponível:

1. **Vídeo próprio** em `public/animations/{id}.webm` (só para os ids listados em `src/data/animacoes.json`);
2. **GIF animado** do Pokémon Showdown (`sprites/pokemon/other/showdown/{id}.gif` no repositório PokeAPI/sprites);
3. **Arte oficial** estática (a mesma de antes);
4. **Imagem reserva** (`src/assets/images/sem-imagem.svg`), quando não há internet.

O componente que faz essa escolha é `src/components/PokemonArt/PokemonArt.jsx`.

Com "reduzir movimento" ligado no sistema, os passos 1 e 2 são pulados e aparece a arte estática.

## Passo a passo para cada Pokémon

1. No Higgsfield, crie um vídeo do tipo **imagem para vídeo**, usando como quadro inicial a arte oficial do Pokémon:
   `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png`
2. Configure 5 segundos e formato quadrado (1:1), se houver essa opção. Use o prompt abaixo, trocando `[MOVIMENTO]` e `[FUNDO]`.
3. Baixe o MP4 e converta para WebM com fundo transparente (comando abaixo).
4. Salve como `public/animations/{id}.webm` e acrescente o id em `src/data/animacoes.json`, por exemplo `[25, 6]`.

Faça um teste com o Pikachu (25) e confira no app antes de gerar os outros.

## Prompt

```text
Seamless looping idle animation of the creature in the reference image. It stays in place,
centered, full body always visible, facing the same direction. [MOVIMENTO]
Static camera: no zoom, no pan, no cuts. Keep the exact design, colors and proportions of the
reference. Solid flat [FUNDO] background, no shadow on the background, no text, no other objects.
```

`[FUNDO]` é `pure green (#00FF00)`. Para Pokémon verdes, use `pure magenta (#FF00FF)`, senão o recorte apaga parte do corpo.

## Lista por prioridade

| Id | Pokémon | Fundo | `[MOVIMENTO]` |
|---:|---|---|---|
| 25 | Pikachu | verde | Its ears twitch, it blinks and small sparks crackle on its red cheeks. |
| 6 | Charizard | verde | It slowly flaps its wings and the flame on its tail flickers. |
| 150 | Mewtwo | verde | It floats slightly up and down, its tail sways and a faint purple aura pulses. |
| 1 | Bulbasaur | magenta | It blinks and the bulb on its back gently swells as it breathes. |
| 4 | Charmander | verde | It blinks and the flame on its tail flickers. |
| 7 | Squirtle | verde | It blinks, smiles and its curled tail sways. |
| 3 | Venusaur | magenta | The big flower on its back sways and it breathes slowly. |
| 9 | Blastoise | verde | Light mist puffs from its shell cannons and it breathes slowly. |
| 94 | Gengar | verde | It grins and its body floats slightly up and down. |
| 143 | Snorlax | verde | It breathes slowly and deeply, its belly rising and falling. |
| 149 | Dragonite | verde | Its small wings flutter and it hovers slightly. |
| 65 | Alakazam | verde | Its spoons glow faintly and its mustache sways. |
| 130 | Gyarados | verde | Its body undulates like a serpent and its whiskers sway. |

## Conversão para WebM transparente

Instale o [ffmpeg](https://ffmpeg.org/) (no Windows: `winget install Gyan.FFmpeg`). Na pasta do projeto:

```bash
ffmpeg -i pikachu.mp4 -vf "chromakey=0x00ff00:0.16:0.08,scale=332:332:force_original_aspect_ratio=decrease,fps=24" -c:v libvpx-vp9 -pix_fmt yuva420p -crf 34 -b:v 0 -an -t 5 public/animations/25.webm
```

- Fundo magenta: troque `0x00ff00` por `0xff00ff`.
- Sobrou borda colorida: aumente o primeiro número (`0.16` → `0.2`). Sumiu parte do Pokémon: diminua.
- O vídeo não volta ao início de forma suave: acrescente ida e volta trocando `-vf "..."` por
  `-filter_complex "[0]chromakey=0x00ff00:0.16:0.08,scale=332:332:force_original_aspect_ratio=decrease,fps=24,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1"`.

Cada arquivo deve ficar com menos de 1 MB. A transparência do WebM funciona no Chrome, no Edge e no Firefox; no Safari ela pode não aparecer.
