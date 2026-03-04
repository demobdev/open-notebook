'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2, UploadCloud, FileAudio, FileText, Play, Download, User } from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'
import { Progress } from "@/components/ui/progress"
import { useSpeakerProfiles } from '@/lib/hooks/use-podcasts'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

// Fake Voice Data (Standard ElevenLabs voices)
const standardVoices = [
  { id: 'XB0fDUnXU5sweG83Nnwe', name: 'Charlotte', description: 'Calm, Professional' },
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', description: 'Energetic, Conversational' },
  { id: 'pNInz6obpgDQGcFmaJcg', name: 'Adam', description: 'Deep, Authoritative' },
]

export default function ExpressPage() {
  const { toast } = useToast()
  
  // State for the form
  const [fileType, setFileType] = useState<'text' | 'audio'>('text')
  const [file, setFile] = useState<File | null>(null)
  const [voiceId, setVoiceId] = useState<string>('')
  
  // State for processing and result
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState("")
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  
  // Fetch real speaker profiles from the backend
  const { speakerProfiles } = useSpeakerProfiles()
  

  // Consolidate standard and custom voices
  const allVoices = useMemo(() => {
    // 1. Map standard voices
    const standard = standardVoices.map(v => ({
      id: v.id,
      name: v.name,
      description: v.description,
      isCustom: false
    }))

    // 2. Extract custom voices from ElevenLabs speaker profiles
    const custom = (speakerProfiles || [])
      .filter(profile => profile.tts_provider === 'elevenlabs')
      .flatMap(profile => 
        profile.speakers.map(speaker => ({
          id: speaker.voice_id,
          name: speaker.name,
          description: `Custom: ${profile.name}`,
          isCustom: true
        }))
      )

    return { standard, custom }
  }, [speakerProfiles])
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setAudioUrl(null)
      setProgress(0)
      setStatusMessage("")
    }
  }

  const startPolling = (jobId: string) => {
    const pollInterval = window.setInterval(async () => {
      try {
        const response = await fetch(`/api/express/jobs/${jobId}`);
        if (!response.ok) {
          throw new Error("Failed to check job status");
        }
        
        const data = await response.json();
        
        if (data.status === "completed") {
          window.clearInterval(pollInterval);
          setIsGenerating(false);
          setAudioUrl(data.result.audio_url);
          setProgress(100);
          setStatusMessage("Audio generated successfully!");
          toast({ title: 'Success!', description: 'Audio generated successfully.' });
        } else if (data.status === "failed") {
          window.clearInterval(pollInterval);
          setIsGenerating(false);
          setProgress(0);
          throw new Error(data.error_message || "Generation failed");
        } else {
          // Status is in progress or submitted
          const progressVal = data.progress?.percentage || 0;
          setProgress(progressVal);
          setStatusMessage(data.progress?.message || "Processing in background...");
        }
      } catch (error: Error | unknown) {
        window.clearInterval(pollInterval);
        setIsGenerating(false);
        const errorMsg = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
      }
    }, 1500); // Poll every 1.5 seconds
  };

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
    setProgress(5)
    setStatusMessage("Uploading file...")
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
      
      if (data.job_id) {
        startPolling(data.job_id);
      } else {
        throw new Error("No job ID returned from server")
      }
      
    } catch (error: unknown) {
      setIsGenerating(false)
      setProgress(0)
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' })
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
              <div className="space-y-2 relative">
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
                    <SelectGroup>
                      <SelectLabel>Standard Voices</SelectLabel>
                      {allVoices.standard.map(voice => (
                        <SelectItem key={voice.id} value={voice.id}>
                          {voice.name} <span className="text-muted-foreground text-xs ml-1">({voice.description})</span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    
                    {allVoices.custom.length > 0 && (
                      <SelectGroup>
                        <SelectLabel>Your Custom Voices</SelectLabel>
                        {allVoices.custom.map((voice, idx) => (
                          <SelectItem key={`${voice.id}-${idx}`} value={voice.id}>
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3 text-primary" />
                              <span>{voice.name}</span>
                              <span className="text-muted-foreground text-xs">({voice.description})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Progress Bar (Visible while generating) */}
              {isGenerating && (
                <div className="space-y-2 animate-in fade-in duration-300 mt-4 p-4 border rounded-lg bg-muted/20">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      {statusMessage}
                    </span>
                    <span className="text-muted-foreground font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

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
                    Generating in background...
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

