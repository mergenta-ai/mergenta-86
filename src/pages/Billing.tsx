import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Download, Calendar, CreditCard, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Billing = () => {
  const navigate = useNavigate();

  const invoices = [
    {
      id: 'INV-001',
      date: '2024-01-15',
      amount: '$29.00',
      status: 'Paid',
      plan: 'Pro Plan',
      downloadUrl: '#'
    },
    {
      id: 'INV-002',
      date: '2023-12-15',
      amount: '$29.00',
      status: 'Paid',
      plan: 'Pro Plan',
      downloadUrl: '#'
    },
    {
      id: 'INV-003',
      date: '2023-11-15',
      amount: '$29.00',
      status: 'Paid',
      plan: 'Pro Plan',
      downloadUrl: '#'
    },
  ];

  const paymentMethods = [
    {
      id: '1',
      type: 'Visa',
      last4: '4242',
      expiryMonth: '12',
      expiryYear: '2027',
      isDefault: true
    },
    {
      id: '2',
      type: 'Mastercard',
      last4: '5555',
      expiryMonth: '08',
      expiryYear: '2026',
      isDefault: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            ← Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Billing & Payment
          </h1>
          <p className="text-muted-foreground">
            Manage your subscription, payment methods, and download invoices
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Subscription */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Current Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Pro Plan</h3>
                    <p className="text-muted-foreground">$29.00 per month</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Next billing date: February 15, 2024
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Change Plan
                    </Button>
                    <Button variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
                <div className="bg-accent/20 rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2">Usage this month:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">AI Conversations:</span>
                      <span className="text-foreground">2,847 / 10,000</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '28.47%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Invoice History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Receipt className="h-5 w-5 mr-2" />
                  Invoice History
                </CardTitle>
                <CardDescription>
                  Download and view your past invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{invoice.id}</p>
                        <p className="text-sm text-muted-foreground">{invoice.plan}</p>
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(invoice.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">{invoice.amount}</p>
                        <p className="text-sm text-green-600">{invoice.status}</p>
                        <Button variant="ghost" size="sm" className="mt-1">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Manage your payment methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">{method.type}</span>
                      </div>
                      {method.isDefault && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      •••• •••• •••• {method.last4}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expires {method.expiryMonth}/{method.expiryYear}
                    </p>
                    <div className="flex space-x-2 mt-3">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">Remove</Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-medium text-foreground">John Doe</p>
                  <p className="text-muted-foreground">123 Main Street</p>
                  <p className="text-muted-foreground">San Francisco, CA 94105</p>
                  <p className="text-muted-foreground">United States</p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Update Address
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;