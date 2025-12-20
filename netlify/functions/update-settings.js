// Netlify Serverless Function to update settings in GitHub

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  try {
    // Get environment variables
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_OWNER = process.env.GITHUB_OWNER;
    const GITHUB_REPO = process.env.GITHUB_REPO;
    const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

    // Check if all required environment variables are set
    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
      console.error('Missing environment variables');
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }

    // Parse the incoming settings data
    const newSettings = JSON.parse(event.body);

    // GitHub API base URL
    const GITHUB_API = 'https://api.github.com';
    const FILE_PATH = 'public/settings.json';

    // Step 1: Get the current file to get its SHA (required for updates)
    const getFileResponse = await fetch(
      `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Wonder-Fashions-App',
        },
      }
    );

    let fileSha = null;

    if (getFileResponse.ok) {
      const fileData = await getFileResponse.json();
      fileSha = fileData.sha;
    } else if (getFileResponse.status !== 404) {
      // If error is not "file not found", throw error
      const errorText = await getFileResponse.text();
      console.error('GitHub API Error:', errorText);
      throw new Error(`GitHub API error: ${getFileResponse.status}`);
    }

    // Step 2: Create or update the file
    const content = Buffer.from(JSON.stringify(newSettings, null, 2)).toString('base64');

    const updatePayload = {
      message: `Update settings via admin panel - ${new Date().toISOString()}`,
      content: content,
      branch: GITHUB_BRANCH,
    };

    // Include SHA if updating existing file
    if (fileSha) {
      updatePayload.sha = fileSha;
    }

    const updateResponse = await fetch(
      `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Wonder-Fashions-App',
        },
        body: JSON.stringify(updatePayload),
      }
    );

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('GitHub Update Error:', errorText);
      throw new Error(`Failed to update settings: ${updateResponse.status}`);
    }

    const result = await updateResponse.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        message: 'Settings updated successfully. Changes will be live in 1-2 minutes after rebuild.',
        commit: result.commit?.sha,
      }),
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Failed to update settings',
        message: error.message 
      }),
    };
  }
};