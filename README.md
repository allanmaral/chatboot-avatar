## Getting Started

### Downloading required binaries

Before running the project you will need [FFmpeg](https://ffmpeg.org/) and [Rhubarb](https://github.com/DanielSWolf/rhubarb-lip-sync).

Download a static version of **FFmpeg** binary for your OS [here](https://johnvansickle.com/ffmpeg/) and put it in your bin folder. **FFmpeg** executable should be accessible through `bin/ffmpeg`.

Download the **Rhubarb** binary for your OS [here](https://github.com/DanielSWolf/rhubarb-lip-sync/releases) and put it in your bin folder. **Rhubarb** executable should be accessible through `bin/rhubarb`.

### Configuring API Key

Create a `.env` file in the root of the repository with your OpenAI API Key

```env
OPENAI_API_KEY=sk-....
```

### Running the server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
