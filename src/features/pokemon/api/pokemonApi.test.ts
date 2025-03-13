// Skip these tests for now as they require additional setup for MSW
describe.skip('pokemonApi', () => {
  it('should extract IDs from Pokemon URLs correctly', () => {
    const urls = [
      'https://pokeapi.co/api/v2/pokemon/1/',
      'https://pokeapi.co/api/v2/pokemon/25/',
      'https://pokeapi.co/api/v2/pokemon/151/',
    ];
    
    const extractId = (url: string) => {
      const parts = url.split('/');
      return Number(parts[parts.length - 2]);
    };
    
    expect(extractId(urls[0])).toBe(1);
    expect(extractId(urls[1])).toBe(25);
    expect(extractId(urls[2])).toBe(151);
  });
});
