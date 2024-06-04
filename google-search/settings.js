let settings;

async function main(mod) {
  settings = mod;

  // Listen for the submit event and handle validation
  settings.on('submit', function (event, data) {
    // Validate search query
    if (!data.searchQuery || data.searchQuery.split(' ').length < 2) {
      return {
        error: new Error('The search query must be two or more words.'),
        input: 'searchQuery'
      };
    }

    // Validate proxy format if provided
    if (data.proxy && !/^(\d{1,3}\.){3}\d{1,3}:\d{1,5}$/.test(data.proxy)) {
      return {
        error: new Error('Invalid proxy format. Use IP:Port format.'),
        input: 'proxy'
      };
    }

    // Validate threads
    if (data.threads < 1) {
      return {
        error: new Error('Number of threads must be at least 1.'),
        input: 'threads'
      };
    }

    // Validate rotation time
    if (data.rotationTime < 1000) {
      return {
        error: new Error('Rotation time must be at least 1000 ms.'),
        input: 'rotationTime'
      };
    }
  });
}

module.exports = main;
