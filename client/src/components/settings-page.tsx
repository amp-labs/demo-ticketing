import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConnectProvider } from "@amp-labs/react";

export default function SettingsPage() {
  return (
    <div className="bg-zinc-900 text-zinc-100 p-6 mx-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Integrations Section */}
        <section>
          <h2 className="text-sm font-medium text-zinc-400 mb-4">
            INTEGRATIONS
          </h2>
          <div className="space-y-3">
            <Card className="bg-zinc-800/50 border-zinc-700">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-[#fff] flex items-center justify-center">
                    <img
                      src="/images/asana_logo.png"
                      alt="Asana"
                      width={40}
                      height={40}
                      // className="opacity-0"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-100">Asana</h3>
                    <p className="text-sm text-zinc-400">
                      Sync tasks to Asana from meeting summaries{" "}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <ConnectProvider
                    provider="asana"
                    consumerRef={"demo-ticketing-ampersand-user"}
                    consumerName={"demo-ticketing-ampersand-user"}
                    groupRef={"demo-ticketing-ampersand-team"}
                    groupName={"demo-ticketing-ampersand-team"}
                    onConnectSuccess={() => console.log("Connected to Asana")}
                  />
                </div>
              </div>
            </Card>
            <Card className="bg-zinc-800/50 border-zinc-700">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-[#E01E5A] flex items-center justify-center">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-18%20at%207.25.35%E2%80%AFPM-xTs9CQeuD11Kz3UbqdUXSArMAICAV2.png"
                      alt="Slack"
                      width={24}
                      height={24}
                      className="opacity-0"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-100">Slack</h3>
                    <p className="text-sm text-zinc-400">
                      Automatically send highlights to Slack in real-time.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-zinc-800/50 border-zinc-700">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-[#00A1E0] flex items-center justify-center">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-18%20at%207.25.35%E2%80%AFPM-xTs9CQeuD11Kz3UbqdUXSArMAICAV2.png"
                      alt="Salesforce"
                      width={24}
                      height={24}
                      className="opacity-0"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-100">Salesforce</h3>
                    <p className="text-sm text-zinc-400">
                      Sync call summaries & highlights to matching Contacts,
                      Accounts, and open Opportunities.{" "}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-zinc-400">
                    0 of 3 seats in use
                  </span>
                </div>
              </div>
            </Card>

            <Card className="bg-zinc-800/50 border-zinc-700">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-[#FF7A59] flex items-center justify-center">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-18%20at%207.25.35%E2%80%AFPM-xTs9CQeuD11Kz3UbqdUXSArMAICAV2.png"
                      alt="HubSpot"
                      width={24}
                      height={24}
                      className="opacity-0"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-100">HubSpot</h3>
                    <p className="text-sm text-zinc-400">
                      Sync call summaries & highlights to matching Contacts,
                      Companies and open Deals{" "}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-zinc-400">
                    0 of 3 seats in use
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </section>
        
        {/* Test Task Creation Section */}
        <section>
          <h2 className="text-sm font-medium text-zinc-400 mb-4 mt-8">
            Create tasks in Asana
          </h2>
          <Card className="bg-zinc-800/50 border-zinc-700">
            <div className="p-4">
              <Button 
                onClick={async () => {
                  try {
                    const response = await fetch('http://localhost:4001/api/create-tasks', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        tasks: [
                          {
                            title: "Follow up with client",
                            description: "Schedule follow-up meeting to discuss requirements",
                            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
                            projectId: "5555555555",
                            tags: ["client", "follow-up"]
                          },
                          {
                            title: "Prepare presentation",
                            description: "Create slides for next week's meeting",
                            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
                            projectId: "5555555555",
                            tags: ["presentation"]
                          }
                        ],
                        workspaceId: "9876543210",
                        assigneeId: "1234567890",
                        meetingId: "123e4567-e89b-12d3-a456-426614174000"
                      })
                    });
                    
                    if (!response.ok) {
                      throw new Error('Failed to create tasks');
                    }
                    
                    alert('Tasks created successfully!');
                  } catch (error) {
                    console.error('Error creating tasks:', error);
                    alert('Failed to create tasks. Check console for details.');
                  }
                }}
                variant="outline"
                className="w-full"
              >
                Create Test Tasks
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
