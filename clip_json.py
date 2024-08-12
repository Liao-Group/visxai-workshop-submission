import json
from collections import defaultdict


def clip_sequence(sequence, clip_length=5):
    """Clip the sequence by removing `clip_length` nucleotides from each end."""
    return sequence[clip_length:-clip_length]

def clip_structure(struct, clip_length=5):
    """Clip the struct by removing `clip_length` positions from each end."""
    return struct[clip_length:-clip_length]

def adjust_positions(positions, clip_length=5):
    """Adjust the position names after clipping."""
    keys_to_delete = []
    for key,value in positions.items():
        if int(key.strip('pos_')) <= clip_length or int(key.strip('pos_')) > len(sequence):
            print(key)
            keys_to_delete.append(key)
    for key in keys_to_delete:
        positions.pop(key)
       
    return positions

filename = 'data/exon_s1_comp_grid9_strengths'
# Load and parse the JSON data
with open(filename+'.json', 'r') as file:
    data = json.load(file)

print(len(data['sequence']),len(data['structs']))
sequence = clip_sequence(data['sequence'])
struct = clip_structure(data['structs'])

# Adjust inclusion and skipping positions
inclusion_strength = adjust_positions(data['inclusion'])
skipping_strength = adjust_positions(data['skipping'])

flattened_inclusion_strength = adjust_positions(data['flattened_inclusion'])
flattened_skipping_strength = adjust_positions(data['flattened_skipping'])
psi = data['psi']
delta_strength = data['delta_strength']

print(len(sequence),len(struct))

organized_data = {
    "sequence": sequence.replace('T', 'U'),
    "structs": struct,
    "psi": psi,
    "delta_strength": delta_strength,
    "inclusion": inclusion_strength,
    "skipping": skipping_strength,
    "flattened_inclusion": flattened_inclusion_strength,
    "flattened_skipping": flattened_skipping_strength,
    "metadata": {
        "total_positions": len(inclusion_strength),
        "sum_inclusion_strength": sum(inclusion_strength.values()),
        "sum_skipping_strength": sum(skipping_strength.values())
    }
}

# Save the organized data to a JSON file
output_file = f'{filename}_clipped.json'
with open(output_file, 'w') as json_file:
    json.dump(organized_data, json_file, indent=2)

print(f"\nAnalysis complete. Results saved to '{output_file}'")


