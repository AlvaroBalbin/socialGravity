import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TopBar() {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border-b border-gray-100">
      {/* Upload button */}
      <button className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex-shrink-0">
        <Upload className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
      </button>

      {/* Audience input */}
      <div className="flex-1 max-w-2xl">
        <Input
          type="text"
          placeholder="Describe your audience (e.g., 'Gen Z aesthetic fashion girls in NYC')"
          className="h-12 px-5 bg-gray-50 border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300"
          defaultValue="Gen Z aesthetic fashion girls in NYC"
        />
      </div>

      {/* Personas count */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-sm text-gray-500">Personas</span>
        <div className="w-14 h-12 flex items-center justify-center border border-gray-200 rounded-xl bg-white">
          <span className="text-sm font-medium text-gray-900">30</span>
        </div>
      </div>

      {/* Run Simulation button */}
      <Button className="h-12 px-6 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium text-sm flex-shrink-0">
        Run Simulation
      </Button>
    </div>
  );
}