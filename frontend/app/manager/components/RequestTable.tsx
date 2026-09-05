import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const RequestTable = () => {
  return (
    <div>
              <Table>

  <TableHeader>

    <TableRow>
      <TableHead>Employee</TableHead>
      <TableHead>Resource</TableHead>
      <TableHead>Quantity</TableHead>
      <TableHead>Date</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Action</TableHead>
    </TableRow>

  </TableHeader>

  <TableBody>

    <TableRow>

      <TableCell>John</TableCell>

      <TableCell>Laptop</TableCell>

      <TableCell>2</TableCell>

      <TableCell>2 Jun 2026</TableCell>

      <TableCell>
        <Badge>
          Pending
        </Badge>
      </TableCell>

      <TableCell>

        <div className="flex gap-2">

          <Button size="sm">
            Approve
          </Button>

          <Button
            size="sm"
            variant="destructive"
          >
            Reject
          </Button>

        </div>

      </TableCell>

    </TableRow>

  </TableBody>

</Table>
    </div>
  )
}
