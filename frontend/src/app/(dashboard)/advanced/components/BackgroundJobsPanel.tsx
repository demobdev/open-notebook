'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2, RefreshCw } from 'lucide-react'

import { commandsApi, CommandJobListItem } from '@/lib/api/commands'
import { useTranslation } from '@/lib/hooks/use-translation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

const QUERY_KEY = ['commands', 'jobs']

function formatDate(s: string | undefined) {
  if (!s) return '—'
  try {
    const d = new Date(s)
    return d.toLocaleString()
  } catch {
    return s
  }
}

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation()
  const variant =
    status === 'completed'
      ? 'default'
      : status === 'failed'
        ? 'destructive'
        : status === 'running' || status === 'new'
          ? 'secondary'
          : 'outline'
  const label =
    status === 'new'
      ? t.advanced.jobs.new
      : status === 'running'
        ? t.advanced.jobs.running
        : status === 'completed'
          ? t.advanced.jobs.completed
          : status === 'failed'
            ? t.advanced.jobs.failed
            : status
  return <Badge variant={variant}>{label}</Badge>
}

export function BackgroundJobsPanel() {
  const { t } = useTranslation()
  const { data: jobs = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => commandsApi.listJobs({ limit: 30 }),
    refetchInterval: 10000,
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>{t.advanced.jobs.title}</CardTitle>
          <CardDescription>{t.advanced.jobs.desc}</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="ml-2">{t.advanced.jobs.refresh}</span>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading jobs...
          </div>
        ) : jobs.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {t.advanced.jobs.empty}
          </p>
        ) : (
          <ScrollArea className="h-[400px] rounded-md border">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-[1fr_80px_80px_90px_140px_1fr_1fr] gap-2 border-b bg-muted/50 px-3 py-2 text-xs font-semibold">
                <span>{t.advanced.jobs.jobId}</span>
                <span>{t.advanced.jobs.app}</span>
                <span>{t.advanced.jobs.command}</span>
                <span>{t.advanced.jobs.status}</span>
                <span>{t.advanced.jobs.created}</span>
                <span>{t.advanced.jobs.args}</span>
                <span>{t.advanced.jobs.error}</span>
              </div>
              {(jobs as CommandJobListItem[]).map((job) => (
                <div
                  key={job.job_id}
                  className="grid grid-cols-[1fr_80px_80px_90px_140px_1fr_1fr] gap-2 border-b px-3 py-2 text-xs last:border-0"
                >
                  <span className="font-mono truncate" title={String(job.job_id)}>
                    {String(job.job_id).slice(-24)}
                  </span>
                  <span className="truncate">{job.app ?? '—'}</span>
                  <span className="truncate">{job.name ?? '—'}</span>
                  <StatusBadge status={job.status} />
                  <span className="truncate text-muted-foreground">
                    {formatDate(job.created)}
                  </span>
                  <span
                    className="max-w-[120px] truncate text-muted-foreground"
                    title={job.args_preview}
                  >
                    {job.args_preview ?? '—'}
                  </span>
                  <span
                    className="max-w-[120px] truncate text-destructive"
                    title={job.error_message}
                  >
                    {job.error_message ?? '—'}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
