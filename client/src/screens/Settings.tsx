import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Settings as SettingsIcon, 
  Users, 
  Shield, 
  Bell,
  Key,
  Database,
  Save,
  Trash2,
  UserPlus
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Viewer' | 'Operator' | 'Analyst' | 'Admin';
  lastLogin: Date;
  status: 'active' | 'inactive';
}

interface Threshold {
  parameter: string;
  warning: number;
  critical: number;
  unit: string;
  description: string;
  pendingApproval?: boolean;
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState("users");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // todo: replace with real user data from API
  const users: User[] = [
    {
      id: 'USER-001',
      name: 'Sarah Chen',
      email: 'sarah.chen@swops.gov',
      role: 'Admin',
      lastLogin: new Date(Date.now() - 3600000),
      status: 'active'
    },
    {
      id: 'USER-002',
      name: 'Mike Rodriguez',
      email: 'mike.rodriguez@swops.gov',
      role: 'Operator',
      lastLogin: new Date(Date.now() - 7200000),
      status: 'active'
    },
    {
      id: 'USER-003',
      name: 'Dr. Yuki Tanaka',
      email: 'yuki.tanaka@swops.gov',
      role: 'Analyst',
      lastLogin: new Date(Date.now() - 86400000),
      status: 'active'
    },
    {
      id: 'USER-004',
      name: 'Emma Johnson',
      email: 'emma.johnson@swops.gov',
      role: 'Viewer',
      lastLogin: new Date(Date.now() - 172800000),
      status: 'inactive'
    }
  ];

  // todo: replace with real threshold data from API
  const thresholds: Threshold[] = [
    {
      parameter: 'IMF Bz',
      warning: -5,
      critical: -10,
      unit: 'nT',
      description: 'Interplanetary magnetic field Z-component',
      pendingApproval: false
    },
    {
      parameter: 'Dst Index',
      warning: -50,
      critical: -100,
      unit: 'nT',
      description: 'Disturbance storm time index',
      pendingApproval: true
    },
    {
      parameter: 'Kp Index',
      warning: 5,
      critical: 7,
      unit: '',
      description: 'Planetary K-index',
      pendingApproval: false
    },
    {
      parameter: 'Solar Wind Speed',
      warning: 600,
      critical: 800,
      unit: 'km/s',
      description: 'Solar wind velocity',
      pendingApproval: false
    }
  ];

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    webhookNotifications: true,
    dailyReports: true,
    maintenanceAlerts: true
  });

  const handleUserRoleChange = (userId: string, newRole: string) => {
    console.log(`Changing user ${userId} role to ${newRole}`);
    // todo: implement user role change with RBAC validation
  };

  const handleThresholdChange = (parameter: string, type: 'warning' | 'critical', value: number) => {
    console.log(`Threshold change: ${parameter} ${type} = ${value}`);
    // todo: implement threshold change with two-person approval workflow
  };

  const handleDeleteUser = (userId: string) => {
    console.log(`Deleting user: ${userId}`);
    // todo: implement user deletion with confirmation
  };

  const handleAddApiKey = () => {
    console.log('Adding new API key');
    // todo: implement API key generation
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'destructive';
      case 'Analyst': return 'default';
      case 'Operator': return 'secondary';
      case 'Viewer': return 'outline';
      default: return 'outline';
    }
  };

  const selectedUserData = users.find(u => u.id === selectedUser);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings & Administration</h1>
          <p className="text-muted-foreground">
            System configuration, user management, and security settings
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-3 gap-6">
            
            {/* User List */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Users</CardTitle>
                    <Button size="sm" data-testid="button-add-user">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className={`p-3 rounded-lg border cursor-pointer hover-elevate transition-colors ${
                        selectedUser === user.id ? 'border-primary bg-muted/50' : 'border-border'
                      }`}
                      onClick={() => setSelectedUser(user.id)}
                      data-testid={`user-${user.id.toLowerCase()}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          user.status === 'active' ? 'bg-weather-normal' : 'bg-muted'
                        }`} />
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {user.status === 'active' ? '1h ago' : '2d ago'}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* User Details */}
            <div className="col-span-2">
              {selectedUserData ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        {selectedUserData.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Email</Label>
                          <Input value={selectedUserData.email} disabled />
                        </div>
                        <div>
                          <Label>Role</Label>
                          <Select 
                            value={selectedUserData.role}
                            onValueChange={(value) => handleUserRoleChange(selectedUserData.id, value)}
                          >
                            <SelectTrigger data-testid="select-user-role">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Viewer">Viewer</SelectItem>
                              <SelectItem value="Operator">Operator</SelectItem>
                              <SelectItem value="Analyst">Analyst</SelectItem>
                              <SelectItem value="Admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Last Login</div>
                          <div className="font-mono">
                            {selectedUserData.lastLogin.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Status</div>
                          <Badge variant={selectedUserData.status === 'active' ? 'default' : 'secondary'}>
                            {selectedUserData.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t">
                        <Button size="sm" data-testid="button-save-user">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteUser(selectedUserData.id)}
                          data-testid="button-delete-user"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete User
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Role Permissions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Role Permissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="font-medium">View Alerts</div>
                            <div className="text-muted-foreground">Can view active and historical alerts</div>
                          </div>
                          <div className="text-right">
                            <Badge variant="default">✓</Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="font-medium">Acknowledge Alerts</div>
                            <div className="text-muted-foreground">Can acknowledge and manage alerts</div>
                          </div>
                          <div className="text-right">
                            <Badge variant={selectedUserData.role === 'Viewer' ? 'secondary' : 'default'}>
                              {selectedUserData.role === 'Viewer' ? '✗' : '✓'}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="font-medium">Run Playbooks</div>
                            <div className="text-muted-foreground">Can execute operational playbooks</div>
                          </div>
                          <div className="text-right">
                            <Badge variant={['Operator', 'Analyst', 'Admin'].includes(selectedUserData.role) ? 'default' : 'secondary'}>
                              {['Operator', 'Analyst', 'Admin'].includes(selectedUserData.role) ? '✓' : '✗'}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="font-medium">Modify Thresholds</div>
                            <div className="text-muted-foreground">Can change alert thresholds</div>
                          </div>
                          <div className="text-right">
                            <Badge variant={selectedUserData.role === 'Admin' ? 'default' : 'secondary'}>
                              {selectedUserData.role === 'Admin' ? '✓' : '✗'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="h-full">
                  <CardContent className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold">Select a User</h3>
                      <p className="text-muted-foreground">
                        Choose a user from the list to view and edit details
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="thresholds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Alert Thresholds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {thresholds.map((threshold) => (
                  <div key={threshold.parameter} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">{threshold.parameter}</div>
                        <div className="text-sm text-muted-foreground">{threshold.description}</div>
                      </div>
                      {threshold.pendingApproval && (
                        <Badge variant="secondary">Pending Approval</Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Warning Level</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            type="number" 
                            value={threshold.warning}
                            onChange={(e) => handleThresholdChange(threshold.parameter, 'warning', Number(e.target.value))}
                            className="w-24"
                          />
                          <span className="text-sm text-muted-foreground">{threshold.unit}</span>
                        </div>
                      </div>
                      <div>
                        <Label>Critical Level</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            type="number" 
                            value={threshold.critical}
                            onChange={(e) => handleThresholdChange(threshold.parameter, 'critical', Number(e.target.value))}
                            className="w-24"
                          />
                          <span className="text-sm text-muted-foreground">{threshold.unit}</span>
                        </div>
                      </div>
                      <div className="flex items-end">
                        <Button size="sm" data-testid="button-save-threshold">
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-weather-elevated/20 rounded-lg">
                <div className="text-sm font-medium">Two-Person Approval Required</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Threshold changes for production systems require approval from two administrators before taking effect.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Alerts</div>
                    <div className="text-sm text-muted-foreground">Receive alert notifications via email</div>
                  </div>
                  <Switch 
                    checked={notificationSettings.emailAlerts}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailAlerts: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">SMS Alerts</div>
                    <div className="text-sm text-muted-foreground">Receive critical alerts via SMS</div>
                  </div>
                  <Switch 
                    checked={notificationSettings.smsAlerts}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, smsAlerts: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Webhook Notifications</div>
                    <div className="text-sm text-muted-foreground">Send alerts to external systems</div>
                  </div>
                  <Switch 
                    checked={notificationSettings.webhookNotifications}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, webhookNotifications: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Daily Reports</div>
                    <div className="text-sm text-muted-foreground">Receive daily activity summaries</div>
                  </div>
                  <Switch 
                    checked={notificationSettings.dailyReports}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, dailyReports: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Maintenance Alerts</div>
                    <div className="text-sm text-muted-foreground">System maintenance notifications</div>
                  </div>
                  <Switch 
                    checked={notificationSettings.maintenanceAlerts}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, maintenanceAlerts: checked }))}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button data-testid="button-save-notifications">
                  <Save className="w-4 h-4 mr-2" />
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  API Keys
                </CardTitle>
                <Button size="sm" onClick={handleAddApiKey} data-testid="button-add-api-key">
                  <Key className="w-4 h-4 mr-2" />
                  Add API Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-mono text-sm">swops_ak_1a2b3c4d5e6f...</div>
                      <div className="text-xs text-muted-foreground">Production API Key - Created 2025-09-10</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">Active</Badge>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-mono text-sm">swops_ak_9z8y7x6w5v4u...</div>
                      <div className="text-xs text-muted-foreground">Development API Key - Created 2025-09-05</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Inactive</Badge>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Retention
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Alert History</Label>
                    <Select defaultValue="1year">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6months">6 months</SelectItem>
                        <SelectItem value="1year">1 year</SelectItem>
                        <SelectItem value="2years">2 years</SelectItem>
                        <SelectItem value="indefinite">Indefinite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Time Series Data</Label>
                    <Select defaultValue="2years">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1year">1 year</SelectItem>
                        <SelectItem value="2years">2 years</SelectItem>
                        <SelectItem value="5years">5 years</SelectItem>
                        <SelectItem value="indefinite">Indefinite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Version</div>
                    <div className="font-mono">v2.1.3</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Uptime</div>
                    <div className="font-mono">15d 8h 23m</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Database</div>
                    <div className="font-mono">PostgreSQL 15.4</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Environment</div>
                    <div className="font-mono">Production</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}