import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Shield } from "lucide-react";

interface SenderRule {
  id: string;
  sender_email: string;
  sender_pattern_type: string;
  sender_name?: string;
  action: string;
  reply_mode?: string;
  custom_prompt?: string;
  priority: number;
  is_active: boolean;
}

export function SenderRulesPanel() {
  const [rules, setRules] = useState<SenderRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<SenderRule | null>(null);

  const [formData, setFormData] = useState<{
    sender_email: string;
    sender_pattern_type: "exact" | "domain" | "wildcard";
    sender_name: string;
    action: "reply" | "ignore" | "forward" | "flag";
    reply_mode: "draft" | "send";
    custom_prompt: string;
    priority: number;
  }>({
    sender_email: "",
    sender_pattern_type: "exact",
    sender_name: "",
    action: "reply",
    reply_mode: "draft",
    custom_prompt: "",
    priority: 0,
  });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("email_sender_rules")
        .select("*")
        .eq("user_id", user.id)
        .order("priority", { ascending: true });

      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error("Error fetching rules:", error);
      toast.error("Failed to load sender rules");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRule = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const ruleData: any = {
        sender_email: formData.sender_email,
        sender_pattern_type: formData.sender_pattern_type,
        sender_name: formData.sender_name || null,
        action: formData.action,
        reply_mode: formData.action === "reply" ? formData.reply_mode : null,
        custom_prompt: formData.custom_prompt || null,
        priority: formData.priority,
        user_id: user.id,
      };

      if (editingRule) {
        const { error } = await supabase
          .from("email_sender_rules")
          .update(ruleData)
          .eq("id", editingRule.id);
        if (error) throw error;
        toast.success("Rule updated successfully");
      } else {
        const { error } = await supabase
          .from("email_sender_rules")
          .insert(ruleData);
        if (error) throw error;
        toast.success("Rule created successfully");
      }

      setDialogOpen(false);
      setEditingRule(null);
      resetForm();
      fetchRules();
    } catch (error) {
      console.error("Error saving rule:", error);
      toast.error("Failed to save rule");
    }
  };

  const handleDeleteRule = async (id: string) => {
    try {
      const { error } = await supabase
        .from("email_sender_rules")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Rule deleted");
      fetchRules();
    } catch (error) {
      console.error("Error deleting rule:", error);
      toast.error("Failed to delete rule");
    }
  };

  const handleToggleActive = async (id: string, is_active: boolean) => {
    try {
      const { error } = await supabase
        .from("email_sender_rules")
        .update({ is_active: !is_active })
        .eq("id", id);

      if (error) throw error;
      toast.success(`Rule ${!is_active ? "enabled" : "disabled"}`);
      fetchRules();
    } catch (error) {
      console.error("Error toggling rule:", error);
      toast.error("Failed to toggle rule");
    }
  };

  const resetForm = () => {
    setFormData({
      sender_email: "",
      sender_pattern_type: "exact",
      sender_name: "",
      action: "reply",
      reply_mode: "draft",
      custom_prompt: "",
      priority: 0,
    });
  };

  const openEditDialog = (rule: SenderRule) => {
    setEditingRule(rule);
    setFormData({
      sender_email: rule.sender_email,
      sender_pattern_type: rule.sender_pattern_type as "exact" | "domain" | "wildcard",
      sender_name: rule.sender_name || "",
      action: rule.action as "reply" | "ignore" | "forward" | "flag",
      reply_mode: (rule.reply_mode as "draft" | "send") || "draft",
      custom_prompt: rule.custom_prompt || "",
      priority: rule.priority,
    });
    setDialogOpen(true);
  };

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case "reply": return "default";
      case "ignore": return "secondary";
      case "forward": return "outline";
      default: return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Sender Rules
            </CardTitle>
            <CardDescription>
              Configure how Mergenta handles emails from specific senders
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingRule(null); resetForm(); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingRule ? "Edit" : "Add"} Sender Rule</DialogTitle>
                <DialogDescription>
                  Create rules to customize email handling based on sender
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="sender_name">Rule Name (Optional)</Label>
                  <Input
                    id="sender_name"
                    placeholder="e.g., Important Client, Spam Filter"
                    value={formData.sender_name}
                    onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sender_email">Sender Email/Pattern *</Label>
                  <Input
                    id="sender_email"
                    placeholder="e.g., boss@company.com or *@spam.com"
                    value={formData.sender_email}
                    onChange={(e) => setFormData({ ...formData, sender_email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pattern_type">Pattern Type</Label>
                  <Select
                    value={formData.sender_pattern_type}
                    onValueChange={(value) => setFormData({ ...formData, sender_pattern_type: value as "exact" | "domain" | "wildcard" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exact">Exact Match</SelectItem>
                      <SelectItem value="domain">Domain (e.g., *@domain.com)</SelectItem>
                      <SelectItem value="wildcard">Wildcard (e.g., *spam*)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="action">Action</Label>
                  <Select
                    value={formData.action}
                    onValueChange={(value) => setFormData({ ...formData, action: value as "reply" | "ignore" | "forward" | "flag" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reply">Reply with AI</SelectItem>
                      <SelectItem value="ignore">Ignore</SelectItem>
                      <SelectItem value="flag">Flag for Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.action === "reply" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="reply_mode">Reply Mode</Label>
                      <Select
                        value={formData.reply_mode}
                        onValueChange={(value) => setFormData({ ...formData, reply_mode: value as "draft" | "send" })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Save as Draft</SelectItem>
                          <SelectItem value="send">Send Automatically</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="custom_prompt">Custom AI Prompt (Optional)</Label>
                      <Textarea
                        id="custom_prompt"
                        placeholder="e.g., Reply in a formal tone, keep it under 100 words..."
                        value={formData.custom_prompt}
                        onChange={(e) => setFormData({ ...formData, custom_prompt: e.target.value })}
                        rows={4}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority (lower = higher priority)</Label>
                  <Input
                    id="priority"
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveRule}>
                  {editingRule ? "Update" : "Create"} Rule
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Loading rules...</p>
        ) : rules.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No sender rules configured yet. Add your first rule to get started.
          </p>
        ) : (
          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {rule.sender_name || rule.sender_email}
                    </span>
                    <Badge variant={getActionBadgeVariant(rule.action)}>
                      {rule.action}
                    </Badge>
                    {rule.reply_mode && (
                      <Badge variant="outline">{rule.reply_mode}</Badge>
                    )}
                    <Badge variant="secondary">Priority: {rule.priority}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {rule.sender_email} ({rule.sender_pattern_type})
                  </p>
                  {rule.custom_prompt && (
                    <p className="text-xs text-muted-foreground italic">
                      Custom prompt configured
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={rule.is_active}
                    onCheckedChange={() => handleToggleActive(rule.id, rule.is_active)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(rule)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteRule(rule.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
