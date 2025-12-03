import { useState } from 'react';
import { AlertCircle, Database, CheckCircle, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { performHealthCheck, HealthCheckResult } from '../utils/systemHealthCheck';
import { toast } from 'sonner@2.0.3';

export function DatabaseSetupGuide() {
  const supabaseProjectUrl = 'https://khpiznboahwnszaavtig.supabase.co';
  const [isChecking, setIsChecking] = useState(false);
  const [healthStatus, setHealthStatus] = useState<HealthCheckResult | null>(null);

  const handleHealthCheck = async () => {
    setIsChecking(true);
    try {
      const result = await performHealthCheck();
      setHealthStatus(result);
      
      if (result.isDatabaseReady && result.isStorageReady && result.errors.length === 0) {
        toast.success('All systems ready! You can now use EaziBook.');
        setTimeout(() => window.location.reload(), 2000);
      } else if (result.errors.length > 0) {
        toast.error('Setup incomplete. See details below.');
      } else if (result.warnings.length > 0) {
        toast.warning('Setup mostly complete, but some features may not work.');
      }
    } catch (error) {
      toast.error('Health check failed. Check console for details.');
      console.error('Health check error:', error);
    } finally {
      setIsChecking(false);
    }
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Alert className="mb-6 border-orange-500 bg-orange-50">
        <AlertCircle className="h-4 w-4 text-orange-600" />
        <AlertTitle className="text-orange-900">Database Setup Required</AlertTitle>
        <AlertDescription className="text-orange-800">
          Your Supabase database needs to be set up before you can use EaziBook. Follow the steps below to get started.
        </AlertDescription>
      </Alert>

      {/* Health Check Status */}
      {healthStatus && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {healthStatus.isDatabaseReady && healthStatus.errors.length === 0 ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-orange-600" />
              )}
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${healthStatus.isDatabaseReady ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>Database Tables: {healthStatus.isDatabaseReady ? 'Ready' : 'Not Set Up'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${healthStatus.isStorageReady ? 'bg-green-500' : 'bg-orange-500'}`} />
              <span>Storage Buckets: {healthStatus.isStorageReady ? 'Ready' : 'Missing'}</span>
            </div>
            
            {healthStatus.errors.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-900 mb-2">Errors:</h4>
                <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
                  {healthStatus.errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {healthStatus.warnings.length > 0 && (
              <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-medium text-orange-900 mb-2">Warnings:</h4>
                <ul className="list-disc list-inside text-sm text-orange-800 space-y-1">
                  {healthStatus.warnings.map((warning, idx) => (
                    <li key={idx}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="mb-6 flex gap-3">
        <Button onClick={handleHealthCheck} disabled={isChecking} variant="outline" className="gap-2">
          {isChecking ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Check System Status
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Quick Setup Guide
          </CardTitle>
          <CardDescription>
            Complete these steps to set up your EaziBook database (takes about 5 minutes)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              1
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-2">Open Supabase SQL Editor</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Click the button below to open your Supabase project's SQL Editor
              </p>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => window.open(`${supabaseProjectUrl}/project/default/sql`, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
                Open SQL Editor
              </Button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              2
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-2">Run Database Schema</h3>
              <p className="text-sm text-muted-foreground mb-3">
                In the SQL Editor:
              </p>
              <ol className="text-sm text-muted-foreground space-y-2 ml-4 list-decimal">
                <li>Click "New Query"</li>
                <li>Open the file <code className="bg-muted px-1 rounded">/SUPABASE_SCHEMA.sql</code> from your project</li>
                <li>Copy ALL the contents</li>
                <li>Paste into the SQL Editor</li>
                <li>Click "Run" or press Ctrl+Enter</li>
                <li>Wait for success confirmation (✓)</li>
              </ol>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              3
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-2">Run Security Policies</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Repeat the same process with:
              </p>
              <ol className="text-sm text-muted-foreground space-y-2 ml-4 list-decimal">
                <li>Click "New Query" again</li>
                <li>Open <code className="bg-muted px-1 rounded">/SUPABASE_RLS_POLICIES.sql</code></li>
                <li>Copy ALL the contents</li>
                <li>Paste and Run</li>
              </ol>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              4
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-2">Create Storage Buckets</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Go to Storage in your Supabase Dashboard and create two public buckets:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 ml-4 list-disc">
                <li><code className="bg-muted px-1 rounded">company-assets</code> (Public, 5MB limit)</li>
                <li><code className="bg-muted px-1 rounded">user-assets</code> (Public, 2MB limit)</li>
              </ul>
              <Button 
                variant="outline" 
                className="gap-2 mt-3"
                onClick={() => window.open(`${supabaseProjectUrl}/storage/buckets`, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
                Open Storage Settings
              </Button>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-2">Refresh and Start Using EaziBook</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Once all steps are complete, refresh this page to start using EaziBook!
              </p>
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Need Help?</h4>
          <p className="text-sm text-muted-foreground">
            Check the <code className="bg-background px-1 rounded">/SUPABASE_SETUP_GUIDE.md</code> file in your project for detailed instructions with screenshots.
          </p>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium mb-2 text-blue-900">Quick Troubleshooting</h4>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>✓ <strong>Connection Issues:</strong> Check your internet connection and refresh the page</li>
            <li>✓ <strong>Timeout Errors:</strong> This is normal if the database isn't set up yet - follow the steps above</li>
            <li>✓ <strong>Upload Fails:</strong> Make sure to create the storage buckets first (Step 4)</li>
            <li>✓ <strong>Still Having Issues:</strong> Try clearing your browser cache and refreshing</li>
          </ul>
        </div>

        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-medium mb-2 text-green-900">After Setup is Complete</h4>
          <p className="text-sm text-green-800 mb-2">
            Once you see all green checkmarks above:
          </p>
          <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
            <li>You can create your company profile</li>
            <li>Upload your company logo</li>
            <li>Start creating invoices and bills</li>
            <li>Manage customers and products</li>
            <li>Access all ERP features</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
