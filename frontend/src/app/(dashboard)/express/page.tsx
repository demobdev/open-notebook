'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, UploadCloud, FileAudio, FileText, Play, Download } from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'

export default function ExpressPage() {
  const { toast } = useToast()
  
  // State for the form
  const [fileType, setFileType] = useState<'text' | 'audio'>('text')
  const [file, setFile] = useState<File | null>(null)
  const [voiceId, setVoiceId] = useState<string>('')
  
  // State for processing and result
  const [isGenerating, setIsGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  
  // Fake Voice Data (MVP requirement to use hardcoded voices for now)
  const availableVoices = [
    { id: 'XB0fDUnXU5sweG83Nnwe', name: 'Charlotte (Calm, Professional)' },
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (Energetic, Conversational)' },
    { id: 'pNInz6obpgDQGcFmaJcg', name: 'Adam (Deep, Authoritative)' },
  ]
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setAudioUrl(null) // Reset audio if file changes
    }
  }

  const handleGenerate = async () => {
    if (!file) {
      toast({ title: 'Missing File', description: 'Please upload a file first.', variant: 'destructive' })
      return
    }
    if (!voiceId) {
      toast({ title: 'Missing Voice', description: 'Please select a voice.', variant: 'destructive' })
      return
    }
    
    setIsGenerating(true)
    setAudioUrl(null)
    
    try {
      const formData = new FormData()
      formData.append('type', fileType)
      formData.append('voice_id', voiceId)
      formData.append('file', file)

      const response = await fetch('/api/express/generate', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Failed to generate audio')
      }

      const data = await response.json()
      setAudioUrl(data.audio_url)
      
      toast({ 
        title: 'Success!', 
        description: data.message || 'Audio generated successfully.',
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto w-full max-w-3xl mx-auto p-4 md:p-8">
        <div className="space-y-6">
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Express Workflow</h1>
            <p className="text-muted-foreground text-sm">
              Quickly convert text to speech (TTS) or speech to speech (STS) without creating a full podcast episode.
            </p>
          </header>

          <Card>
            <CardHeader>
              <CardTitle>Generate Audio Fast (A to B)</CardTitle>
              <CardDescription>
                Upload your file, pick a voice, and hit generate.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Output Type Toggle */}
              <div className="space-y-2">
                <Label>Workflow Type</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant={fileType === 'text' ? 'default' : 'outline'} 
                    onClick={() => { setFileType('text'); setAudioUrl(null); }}
                    className="h-24 flex flex-col gap-2"
                  >
                    <FileText className="h-6 w-6" />
                    Text to Speech (PDF/Txt/MD)
                  </Button>
                  <Button 
                    variant={fileType === 'audio' ? 'default' : 'outline'} 
                    onClick={() => { setFileType('audio'); setAudioUrl(null); }}
                    className="h-24 flex flex-col gap-2"
                  >
                    <FileAudio className="h-6 w-6" />
                    Speech to Speech (Audio)
                  </Button>
                </div>
              </div>

              {/* File Upload Area */}
              <div className="space-y-2">
                 <Label htmlFor="express-file">Upload File</Label>
                 <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer relative">
                    <input 
                      type="file" 
                      id="express-file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept={fileType === 'text' ? '.pdf,.txt,.md' : '.mp3,.wav,.m4a'}
                      onChange={handleFileChange}
                    />
                    <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">
                      {file ? file.name : 'Click or drag file to upload'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {fileType === 'text' ? 'Supports PDF, TXT, MD. Auto-truncates long files for generation.' : 'Supports MP3, WAV, M4A'}
                    </p>
                 </div>
              </div>

              {/* Voice Selection */}
              <div className="space-y-2">
                <Label htmlFor="voice-select">Select Voice</Label>
                <Select value={voiceId} onValueChange={setVoiceId}>
                  <SelectTrigger id="voice-select">
                    <SelectValue placeholder="Choose a voice model..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVoices.map(voice => (
                      <SelectItem key={voice.id} value={voice.id}>
                        {voice.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Audio Result Player */}
              {audioUrl && (
                <div className="mt-6 p-4 border rounded-lg bg-muted/30 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Play className="h-4 w-4" /> Generated Audio
                  </div>
                  <audio controls src={audioUrl} className="w-full h-10 outline-none" />
                  <div className="flex justify-end gap-2">
                    <a href={audioUrl} download={`express_${file?.name || 'audio'}.mp3`}>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Download className="mr-2 h-4 w-4" /> Download
                      </Button>
                    </a>
                  </div>
                </div>
              )}

            </CardContent>
            
            <CardFooter className="bg-muted/10 border-t p-6 flex justify-between">
              <Button variant="ghost" onClick={() => { setFile(null); setVoiceId(''); setAudioUrl(null); }} disabled={isGenerating}>Clear</Button>
              <Button onClick={handleGenerate} disabled={isGenerating || !file || !voiceId} className="w-full sm:w-auto">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Generate Audio'
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}

