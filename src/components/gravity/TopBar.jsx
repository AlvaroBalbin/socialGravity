import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TopBar() {
  return (
    <div className="flex items-center gap-4 px-6 py-4 bg-white border-b border-gray-100">
      {/* Upload button */}
      <button className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex-shrink-0">
        <Upload className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
      </button>

      {/* Audience input */}
      <div className="flex-1 max-w-xl">
        <Input
          type="text"
          placeholder="Describe your audience (e.g., 'Gen Z aesthetic fashion girls in NYC')"
          className="h-11 px-4 bg-gray-50 border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300"
          defaultValue="Gen Z aesthetic fashion girls in NYC"
        />
      </div>

      {/* Run Simulation button */}
      <Button className="h-11 px-5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium text-sm flex-shrink-0">
        Run Simulation
      </Button>
    </div>
  );
}