import { Box, Button, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useState } from 'react'
import './App.css'
import axios from 'axios';
import apiClient from './config/api';
function App() {
  
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const[generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try{
      const response = await apiClient.post("/api/email/generate",{
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data === 'string'?response.data:JSON.stringify(response.data));
    }
    catch(error){
      setError("Failed to generate email reply. Please try again");
    }
    finally{
      setLoading(false);
    }
  };
  const handleCopyToClipboard = ()=>{
    navigator.clipboard.writeText(generatedReply);
    setIsCopied(true);
    setTimeout(()=>{
      setIsCopied(false);
    }, 4000);
  }
  return (
    
     <Container maxWidth="md" sx={{py:4}}>
      <Typography variant='h3' component="h1" gutterBottom>
        AI Email Reply Generator
      </Typography>
      <Box sx={{mx: 3}}>
        <TextField 
        label="Email Content" 
        fullWidth 
        multiline 
        rows={6} 
        variant='outlined' 
        placeholder='Paste your email content here...'
        value={emailContent}
        onChange={(e) => setEmailContent(e.target.value)}
        sx={{mb:3}}>    
        </TextField>
        <FormControl fullWidth sx={{mb:3}}>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select
          value={tone || ''}
          label={"Tone (Optional)"}
          onChange={(e) => setTone(e.target.value)}>
            <MenuItem value="">None</MenuItem>
            <MenuItem value="proffesional">Professional</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
          </Select>
        </FormControl>
        <Button variant='contained' 
        fullWidth
        onClick={handleSubmit}
        disabled={!emailContent || loading}>
          {loading?<CircularProgress size={24}/>: "Generate Reply"}
        </Button>
      </Box>
      { error && (
        <Typography color='error' sx={{ mb:3 }}>
          {error}
        </Typography>
      )}
      { generatedReply && (
        <Box sx={{mt: 3}}>
          <Typography variant='h6' gutterBottom>Generated Reply:</Typography>
          <TextField
          fullWidth
          multiline
          rows={6}
          variant='outlined'
          value={generatedReply || ""}
          inputProps={{readOnly: true}}/>
          <Button
          variant='outlined'
          sx={{mt: 3}}
          onClick={handleCopyToClipboard}>
            {isCopied?"Copied":"Copy to clipboard"}
          </Button>
        </Box>
      )}
     </Container>
    
  )
}

export default App
