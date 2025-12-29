interface Call {
  callNumber: string;
  timestamp: string;
  district: string;
  natureOfCall: string;
  status: string;
  location: {
    type: string;
    latitude?: number;
    longitude?: number;
  };
}

interface DataTableProps {
  calls: Call[];
}

export function DataTable({ calls }: DataTableProps) {
  // Sort calls by timestamp (newest first)
  const sortedCalls = [...calls].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: '#002147' }}>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#FFB800' }}>
                Call Number
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#FFB800' }}>
                Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#FFB800' }}>
                District
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#FFB800' }}>
                Nature of Call
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#FFB800' }}>
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#FFB800' }}>
                Location
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCalls.map((call, index) => {
              const isActive = call.status === 'Dispatched' || call.status === 'Enroute';
              const time = new Date(call.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              });

              return (
                <tr
                  key={call.callNumber}
                  className={index % 2 === 0 ? '' : 'bg-gray-50'}
                  style={{ borderBottom: '1px solid #e5e7eb' }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: '#002147' }}>
                    {call.callNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#002147' }}>
                    {time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold" style={{ color: '#FFB800' }}>
                    D{call.district}
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#002147' }}>
                    {call.natureOfCall}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: isActive ? '#DC2626' : '#10B981',
                        color: '#ffffff'
                      }}
                    >
                      {call.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#002147', opacity: 0.7 }}>
                    {call.location.latitude && call.location.longitude
                      ? `${call.location.latitude.toFixed(4)}, ${call.location.longitude.toFixed(4)}`
                      : 'N/A'
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
