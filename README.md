# Daily Song Sketchpad

A clean, Notion-like dark workspace to capture song ideas daily. Built with Next.js 14, TypeScript, and modern web technologies.

## Features

- **Project Management**: Create, switch, and manage multiple song projects
- **Lyric Editor**: Tabbed interface for Verse/Chorus/Bridge with real-time word/syllable counting
- **Audio Notes**: Record or upload audio clips with playback controls
- **BPM Tap**: Accurate BPM detection with visual feedback
- **Key Selection**: Musical key picker with relative minor/major display
- **Tools Panel**: 
  - **Tuner**: Real-time pitch detection from microphone
  - **Chord Book**: Guitar and piano chord diagrams
  - **Chord Finder**: Find chords based on selected notes
- **Dark Theme**: Beautiful dark UI with smooth animations
- **Keyboard Shortcuts**: Power user features for quick navigation
- **Auto-save**: Automatic saving with debounced updates
- **Offline Support**: IndexedDB with localStorage fallback

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with CSS variables
- **UI Components**: shadcn/ui with Radix UI primitives
- **State Management**: Zustand
- **Database**: IndexedDB via Dexie with localStorage fallback
- **Audio**: Web Audio API, MediaRecorder
- **Animations**: Framer Motion
- **Testing**: Vitest + React Testing Library, Playwright e2e
- **Package Manager**: pnpm

## Prerequisites

- Node.js 20+ 
- pnpm installed globally

## Quick Start

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Start development server**
   ```bash
   pnpm dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript compiler check
- `pnpm test` - Run unit tests with Vitest
- `pnpm test:ui` - Run tests with UI
- `pnpm e2e` - Run Playwright end-to-end tests
- `pnpm e2e:ui` - Run e2e tests with UI
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── WorkspaceShell.tsx # Main workspace layout
│   ├── ProjectHeader.tsx  # Project header with BPM/Key
│   ├── LyricEditor.tsx    # Tabbed lyric editor
│   ├── AudioNote.tsx      # Audio recording/playback
│   ├── Toolbar.tsx        # Main toolbar
│   ├── ToolsPanel.tsx     # Tools panel (Tuner, Chords)
│   ├── ProjectDrawer.tsx  # Project management drawer
│   ├── Tuner.tsx          # Pitch detection
│   ├── ChordBook.tsx      # Chord diagrams
│   └── ChordFinder.tsx    # Chord finding tool
├── lib/                    # Utility libraries
│   ├── store.ts           # Zustand store
│   ├── idb.ts             # IndexedDB operations
│   ├── types.ts           # TypeScript types
│   ├── audio.ts           # Audio utilities
│   ├── music.ts           # Music theory helpers
│   ├── rhyme.ts           # Rhyme dictionary
│   ├── syllables.ts       # Syllable counting
│   └── persist.ts         # Persistence utilities
├── tests/                  # Test files
│   ├── unit/              # Unit tests
│   └── e2e/               # End-to-end tests
└── public/                 # Static assets
```

## Keyboard Shortcuts

- `Cmd/Ctrl + N` - Create new project
- `Cmd/Ctrl + S` - Save (auto-save enabled)
- `Cmd/Ctrl + B` - Toggle project drawer
- `Space` - Focus BPM tap button

## Features in Detail

### Project Management
- Create unlimited projects
- Search and filter projects
- Delete projects with confirmation
- Auto-save all changes

### Lyric Editor
- Tabbed interface for song sections
- Real-time word, syllable, and character counting
- Auto-save with 400ms debounce
- Support for Verse, Chorus, Bridge sections

### Audio Notes
- Record audio using microphone
- Upload audio files
- Playback controls with progress bar
- Store audio in IndexedDB

### BPM Tap
- Tap to set BPM accurately
- Visual feedback and tap counter
- Manual BPM input
- Range: 40-200 BPM

### Musical Tools
- **Tuner**: Real-time pitch detection with cents display
- **Chord Book**: Guitar and piano chord diagrams
- **Chord Finder**: Find chords based on selected notes

## Database Schema

The app uses IndexedDB with the following structure:

- **projects**: Project metadata (title, BPM, key, dates)
- **sections**: Lyric sections for each project
- **clips**: Audio clips with metadata
- **blobs**: Audio file storage

## Troubleshooting

### Microphone Permissions
If the tuner or audio recording doesn't work:
1. Check browser permissions for microphone access
2. Ensure microphone is not muted
3. Try refreshing the page

### IndexedDB Issues
If you experience database errors:
1. The app automatically falls back to localStorage
2. Check browser console for error messages
3. Try clearing browser data for the site

### Audio Playback Issues
- Ensure audio files are in supported formats (WebM, MP3, WAV)
- Check browser audio permissions
- Some browsers require user interaction before playing audio

### Performance Issues
- Large audio files may take time to process
- Consider compressing audio before upload
- The app debounces saves to prevent excessive writes

## Development

### Adding New Features
1. Create components in `components/` directory
2. Add types to `lib/types.ts`
3. Update store in `lib/store.ts`
4. Add tests in `tests/` directory

### Styling
- Use Tailwind CSS classes
- CSS variables defined in `app/globals.css`
- Follow the established color scheme

### Testing
- Unit tests: `pnpm test`
- E2E tests: `pnpm e2e`
- Test coverage for new features

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Search existing GitHub issues
3. Create a new issue with detailed information

---

Built with ❤️ for musicians and songwriters
