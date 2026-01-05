const IGNORE_PATTERNS = [
    /^node_modules\//,
    /^\.git\//,
    /^\.next\//,
    /^dist\//,
    /^build\//,
    /^coverage\//,
    /^\.cache\//,
    /package-lock\.json$/,
    /yarn\.lock$/,
    /pnpm-lock\.yaml$/,
    /\.min\.js$/,
    /\.min\.css$/,
    /\.map$/,
    /\.woff2?$/,
    /\.ttf$/,
    /\.eot$/,
    /\.ico$/,
    /\.png$/,
    /\.jpg$/,
    /\.jpeg$/,
    /\.gif$/,
    /\.svg$/,
    /\.webp$/,
    /\.mp4$/,
    /\.mp3$/,
    /\.pdf$/,
    /\.zip$/,
    /\.tar$/,
    /\.gz$/,
];

const IGNORE_EXTENSIONS = new Set([
    '.lock', '.log', '.map', '.min.js', '.min.css',
    '.woff', '.woff2', '.ttf', '.eot', '.ico',
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp',
    '.mp4', '.mp3', '.pdf', '.zip', '.tar', '.gz'
]);

export function shouldIgnoreFile(path: string): { ignore: boolean; reason?: string } {
    for (const pattern of IGNORE_PATTERNS) {
        if (pattern.test(path)) {
            return { ignore: true, reason: `Matches pattern: ${pattern}` };
        }
    }
    
    const ext = path.substring(path.lastIndexOf('.')).toLowerCase();
    if (IGNORE_EXTENSIONS.has(ext)) {
        return { ignore: true, reason: `Ignored extension: ${ext}` };
    }
    
    return { ignore: false };
}

export function getRelevantFilesOnly(paths: string[]): string[] {
    return paths.filter(p => !shouldIgnoreFile(p).ignore);
}

export function cleanCodeContent(content: string, maxLength = 5000): string {
    let cleaned = content
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*$/gm, '')
        .replace(/^\s*[\r\n]/gm, '')
        .replace(/\s+$/gm, '')
        .replace(/\n{3,}/g, '\n\n');
    
    if (cleaned.length > maxLength) {
        cleaned = cleaned.substring(0, maxLength) + '\n... [truncated]';
    }
    
    return cleaned.trim();
}

export function estimateTokenCount(text: string): number {
    return Math.ceil(text.length / 4);
}

export function createContextSummary(repoName: string, files: string[], maxFiles = 50): string {
    const relevantFiles = getRelevantFilesOnly(files).slice(0, maxFiles);
    
    const dirs = new Set<string>();
    const extensions = new Map<string, number>();
    
    for (const file of relevantFiles) {
        const parts = file.split('/');
        if (parts.length > 1) {
            dirs.add(parts[0]);
        }
        
        const ext = file.substring(file.lastIndexOf('.')).toLowerCase();
        if (ext.length < 10) {
            extensions.set(ext, (extensions.get(ext) || 0) + 1);
        }
    }
    
    const topExtensions = Array.from(extensions.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([ext, count]) => `${ext}(${count})`)
        .join(', ');
    
    return `REPOSITORIO: ${repoName}
DIRECTORIOS: ${Array.from(dirs).slice(0, 10).join(', ')}
EXTENSIONES: ${topExtensions}
ARCHIVOS RELEVANTES (${relevantFiles.length}):
${relevantFiles.join('\n')}`;
}
