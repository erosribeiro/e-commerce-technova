interface SpecsTableProps {
  specs: Record<string, string>;
}

export function SpecsTable({ specs }: SpecsTableProps) {
  // Converte o objeto de specs em um array de entradas (chave, valor)
  const specEntries = Object.entries(specs);

  if (specEntries.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold mb-6 text-foreground">Especificações Técnicas</h3>
      <div className="rounded-xl border border-border overflow-hidden bg-background/30 backdrop-blur-sm">
        <table className="w-full text-left text-sm" aria-label="Especificações do produto">
          <thead className="sr-only">
            <tr>
              <th scope="col">Característica</th>
              <th scope="col">Detalhe</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {specEntries.map(([key, value], index) => (
              <tr 
                key={key} 
                className={`${index % 2 === 0 ? 'bg-background/40' : 'bg-transparent'} hover:bg-accent/50 transition-colors`}
              >
                <th 
                  scope="row" 
                  className="py-4 px-6 font-semibold text-muted-foreground w-1/3 border-r border-border/30 capitalize"
                >
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </th>
                <td className="py-4 px-6 text-foreground">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
