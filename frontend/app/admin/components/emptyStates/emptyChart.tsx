import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'
import React from 'react'

export const EmptyChart = () => {
  return (
   <Card className="h-[390px] w-full">
  <CardHeader className="space-y-2">
    <CardTitle className="text-base font-medium">Chart Title</CardTitle>
    <CardDescription>Description of the chart</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="flex h-56 flex-col items-center justify-center gap-2 px-4 text-center">
      <BarChart3 className="h-10 w-10 text-muted-foreground/40" />
      <p className="text-sm font-medium text-muted-foreground">No data available</p>
      <p className="text-xs text-muted-foreground/70">
        Data will appear here once it&apos;s available.
      </p>
    </div>
  </CardContent>
  <CardFooter>
    <p className="text-xs text-muted-foreground">Last updated: —</p>
  </CardFooter>
</Card>
  )
}
