import React from 'react'
import { TabsContent, TabsList, TabsTrigger,Tabs } from '../ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { User } from 'lucide-react'

export const ResourceTabs = () => {

  return (
    <div>
           <Tabs defaultValue="requests">

            <TabsList>
              <TabsTrigger value="requests">
                Requests
              </TabsTrigger>

              <TabsTrigger value="holders">
                Current Holders
              </TabsTrigger>

              <TabsTrigger value="activity">
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="requests">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Request History
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">

                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div>
                          <p className="font-medium">
                            John Doe
                          </p>

                          <p className="text-sm text-muted-foreground">
                            Requested 2 units
                          </p>
                        </div>

                        <Badge>
                          Approved
                        </Badge>
                      </div>
                    ))}

                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="holders">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Current Holders
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">

                    {[1, 2].map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center gap-3">
                          <User className="h-4 w-4" />

                          <div>
                            <p className="font-medium">
                              Employee Name
                            </p>

                            <p className="text-sm text-muted-foreground">
                              Assigned 5 days ago
                            </p>
                          </div>
                        </div>

                        <Badge>
                          2 Units
                        </Badge>
                      </div>
                    ))}

                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Activity Timeline
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-6">

                    {[
                      "Resource Created",
                      "Quantity Updated",
                      "Assigned To Employee",
                      "Returned By Employee",
                    ].map((event) => (
                      <div
                        key={event}
                        className="flex gap-4"
                      >
                        <div className="mt-2 h-3 w-3 rounded-full bg-primary" />

                        <div>
                          <p className="font-medium">
                            {event}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            2 days ago
                          </p>
                        </div>
                      </div>
                    ))}

                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
    </div>
  )
}
