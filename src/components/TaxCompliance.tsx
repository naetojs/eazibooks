import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { 
  FileText, 
  Calendar, 
  AlertCircle,
  CheckCircle,
  Download,
  Upload,
  Calculator
} from 'lucide-react';

export function TaxCompliance() {
  const [selectedTab, setSelectedTab] = useState('gst');

  const vatReturns = [
    { period: 'January 2025', type: 'VAT Return', dueDate: '2025-02-21', status: 'pending', amount: 875000 },
    { period: 'December 2024', type: 'VAT Return', dueDate: '2025-01-21', status: 'filed', amount: 820000 },
    { period: 'November 2024', type: 'VAT Return', dueDate: '2024-12-21', status: 'filed', amount: 765000 },
    { period: 'October 2024', type: 'VAT Return', dueDate: '2024-11-21', status: 'filed', amount: 712000 },
  ];

  const whtReturns = [
    { period: 'January 2025', type: 'WHT Return', dueDate: '2025-02-10', status: 'pending', amount: 325000 },
    { period: 'December 2024', type: 'WHT Return', dueDate: '2025-01-10', status: 'filed', amount: 298000 },
    { period: 'November 2024', type: 'WHT Return', dueDate: '2024-12-10', status: 'filed', amount: 285000 },
    { period: 'October 2024', type: 'WHT Return', dueDate: '2024-11-10', status: 'filed', amount: 272000 },
  ];

  const taxSummary = {
    vatCollected: 875000,
    vatPaid: 125000,
    vatBalance: 750000,
    whtDeducted: 325000,
    whtRemitted: 298000,
    whtBalance: 27000,
    totalTaxLiability: 777000
  };

  const upcomingDeadlines = [
    { type: 'WHT Return', period: 'January 2025', dueDate: '2025-02-10', daysLeft: 7 },
    { type: 'VAT Return', period: 'January 2025', dueDate: '2025-02-21', daysLeft: 18 },
    { type: 'PAYE Remittance', period: 'January 2025', dueDate: '2025-02-10', daysLeft: 7 },
    { type: 'CIT Estimate', period: 'Q4 2024', dueDate: '2025-01-31', daysLeft: 0 },
    { type: 'Annual Returns', period: 'FY 2024', dueDate: '2025-03-31', daysLeft: 56 },
  ];

  const getDaysLeftBadge = (daysLeft: number) => {
    if (daysLeft <= 3) return 'destructive';
    if (daysLeft <= 7) return 'secondary';
    return 'default';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Tax Compliance</h1>
          <p className="text-muted-foreground">Manage VAT, WHT, PAYE and other Nigerian tax obligations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calculator className="w-4 h-4 mr-2" />
            Tax Calculator
          </Button>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            File Return
          </Button>
        </div>
      </div>

      {/* Tax Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VAT Collected</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{taxSummary.vatCollected.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">WHT Deducted</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{taxSummary.whtDeducted.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Liability</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">₦{taxSummary.totalTaxLiability.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Outstanding amount</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">92%</div>
            <p className="text-xs text-muted-foreground">On-time filings</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{deadline.type}</p>
                  <p className="text-sm text-muted-foreground">{deadline.period}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{deadline.dueDate}</p>
                  <Badge variant={getDaysLeftBadge(deadline.daysLeft)} className="text-xs">
                    {deadline.daysLeft} days left
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vat">VAT Returns</TabsTrigger>
          <TabsTrigger value="wht">WHT Returns</TabsTrigger>
          <TabsTrigger value="summary">Tax Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="vat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>VAT Return Filing</CardTitle>
              <div className="flex gap-2">
                <Button size="sm">Generate VAT Return</Button>
                <Button size="sm" variant="outline">Download Template</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Return Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vatReturns.map((return_, index) => (
                    <TableRow key={index}>
                      <TableCell>{return_.period}</TableCell>
                      <TableCell>{return_.type}</TableCell>
                      <TableCell>{return_.dueDate}</TableCell>
                      <TableCell className="text-right">₦{return_.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={return_.status === 'filed' ? 'default' : 'secondary'}>
                          {return_.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          {return_.status === 'pending' && (
                            <Button size="sm">File Return</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wht" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Withholding Tax (WHT) Returns</CardTitle>
              <Button>Generate WHT Return</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Return Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {whtReturns.map((return_, index) => (
                    <TableRow key={index}>
                      <TableCell>{return_.period}</TableCell>
                      <TableCell>{return_.type}</TableCell>
                      <TableCell>{return_.dueDate}</TableCell>
                      <TableCell className="text-right">₦{return_.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={return_.status === 'filed' ? 'default' : 'secondary'}>
                          {return_.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          {return_.status === 'pending' && (
                            <Button size="sm">File Return</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>VAT Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>VAT Collected (Output)</span>
                  <span className="font-medium">₦{taxSummary.vatCollected.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT Paid (Input)</span>
                  <span className="font-medium">₦{taxSummary.vatPaid.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-medium">
                    <span>Net VAT Payable</span>
                    <span>₦{taxSummary.vatBalance.toLocaleString()}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Payment Progress</span>
                    <span>86%</span>
                  </div>
                  <Progress value={86} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>WHT Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>WHT Deducted</span>
                  <span className="font-medium">₦{taxSummary.whtDeducted.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>WHT Remitted</span>
                  <span className="font-medium">₦{taxSummary.whtRemitted.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-medium">
                    <span>WHT Payable</span>
                    <span>₦{taxSummary.whtBalance.toLocaleString()}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Remittance Progress</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Nigerian Tax Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Monthly</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• WHT Remittance (10th)</li>
                    <li>• PAYE Remittance (10th)</li>
                    <li>• VAT Return (21st)</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Quarterly</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• CIT Estimate (Jan 31)</li>
                    <li>• Advance Tax Payment</li>
                    <li>• TET Returns</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Annually</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Annual Tax Returns (Mar 31)</li>
                    <li>• CIT Returns (Jun 30)</li>
                    <li>• Tax Audit Reports</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Special</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Development Levy</li>
                    <li>• Education Tax (2.5%)</li>
                    <li>• NITDA Levy (1%)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}