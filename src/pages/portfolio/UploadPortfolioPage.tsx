import React, { useState, useCallback } from 'react';
import { parsePortfolioDocument } from '../../services/portfolioService';
import { ParsedPortfolioData } from '../../types/portfolio';

const UploadPortfolioPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedPortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setParsedData(null); // Reset previous results if a new file is selected
      setError(null); // Reset previous errors
    }
  };

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setParsedData(null);

    try {
      const data = await parsePortfolioDocument(selectedFile);
      setParsedData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to parse document. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Upload Portfolio Document</h1>
      <p>Upload a PDF or DOCX file to parse its content into a structured format.</p>
      
      <form onSubmit={handleSubmit}>
        <div>
          <input 
            type="file" 
            accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
            onChange={handleFileChange} 
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={isLoading || !selectedFile} style={{ marginTop: '10px' }}>
          {isLoading ? 'Parsing...' : 'Parse Document'}
        </button>
      </form>

      {error && (
        <div style={{ color: 'red', marginTop: '15px' }}>
          <p>Error: {error}</p>
        </div>
      )}

      {parsedData && (
        <div style={{ marginTop: '20px' }}>
          <h2>Parsed Portfolio Data:</h2>
          {/* 
            Ideally, you'd have a component to render this data meaningfully.
            For now, we'll just display it as a JSON string.
            You might want to create components to display each section of the portfolio.
          */}
          <pre style={{ backgroundColor: '#f4f4f4', padding: '15px', borderRadius: '5px', overflowX: 'auto' }}>
            {JSON.stringify(parsedData, null, 2)}
          </pre>
          {/* 
            You would typically add buttons here to e.g.:
            - "Use this data to create a new portfolio"
            - "Update existing portfolio with this data"
            - "Edit this data before saving"
          */}
        </div>
      )}
    </div>
  );
};

export default UploadPortfolioPage; 