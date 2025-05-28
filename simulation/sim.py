import numpy as np
import matplotlib
matplotlib.use('TkAgg')  # or 'Qt5Agg'
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap

# Config
GRID_SIZE = 50
NUM_PEOPLE = 100
OBSTACLE_RATIO = 0.02
STEPS = 100

# Grid cell meanings
# 0: empty
# -1: obstacle
# 1: person

# Initialize grid
grid = np.zeros((GRID_SIZE, GRID_SIZE), dtype=int)

# Place obstacles
num_obstacles = int(GRID_SIZE * GRID_SIZE * OBSTACLE_RATIO)
obstacle_indices = np.random.choice(GRID_SIZE * GRID_SIZE, num_obstacles, replace=False)
for idx in obstacle_indices:
    x, y = divmod(idx, GRID_SIZE)
    grid[x, y] = -1  # obstacle

# Place people
people = []
while len(people) < NUM_PEOPLE:
    x, y = np.random.randint(0, GRID_SIZE, size=2)
    if grid[x, y] == 0:
        grid[x, y] = 1
        people.append((x, y))

def get_empty_neighbors(pos):
    x, y = pos
    directions = [(-1,0), (1,0), (0,-1), (0,1)]  # up, down, left, right
    neighbors = []
    for dx, dy in directions:
        nx, ny = x + dx, y + dy
        if 0 <= nx < GRID_SIZE and 0 <= ny < GRID_SIZE and grid[nx, ny] == 0:
            neighbors.append((nx, ny))
    return neighbors

def get_best_move(pos):
    x, y = pos
    directions = [(-1,0), (1,0), (0,-1), (0,1)]  # up, down, left, right
    best_score = -1
    best_moves = []

    for dx, dy in directions:
        nx, ny = x + dx, y + dy
        if 0 <= nx < GRID_SIZE and 0 <= ny < GRID_SIZE and grid[nx, ny] == 0:
            # Score based on number of nearby people (encourage clustering)
            score = 0
            for ax, ay in directions:
                adj_x, adj_y = nx + ax, ny + ay
                if 0 <= adj_x < GRID_SIZE and 0 <= adj_y < GRID_SIZE and grid[adj_x, adj_y] == 1:
                    score += 1

            if score > best_score:
                best_score = score
                best_moves = [(nx, ny)]
            elif score == best_score:
                best_moves.append((nx, ny))

    # If we found best moves, return one randomly
    if best_moves:
        return best_moves[np.random.randint(len(best_moves))]
    else:
        return pos  # stay in place if no options

def plot_grid(grid, step):
    cmap = ListedColormap(['white', 'blue', 'black'])  # 0: empty, 1: people, -1: obstacle
    display = np.copy(grid)
    display[display == -1] = 2  # Set obstacle color index to 2
    plt.imshow(display, cmap=cmap)
    plt.title(f"Mela Crowd Movement - Step {step}")
    plt.pause(0.2)
    plt.clf()

# Run simulation
plt.figure(figsize=(7, 7))
for step in range(STEPS):
    new_grid = np.copy(grid)
    new_positions = []

    np.random.shuffle(people)  # Shuffle movement order to avoid bias

    for pos in people:
        x, y = pos
        new_grid[x, y] = 0  # Vacate current spot
        new_pos = get_best_move(pos)
        new_grid[new_pos] = 1
        new_positions.append(new_pos)

    grid = new_grid
    people = new_positions
    plot_grid(grid, step)