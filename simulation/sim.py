import numpy as np
import matplotlib
matplotlib.use('TkAgg')  # or 'Qt5Agg'
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap
from scipy.ndimage import gaussian_filter

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

# Initializing figures
fig1 = plt.figure(1, figsize=(7, 7))
ax1 = fig1.add_subplot(1, 1, 1)

fig2 = plt.figure(2, figsize=(7, 7))  
ax2 = fig2.add_subplot(1, 1, 1)

# Cummulative heat
cumulative_heat = np.zeros((GRID_SIZE, GRID_SIZE), dtype=float)

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

# Slightly biased movement pattern to incentivize the formation of clusters
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

    ax1.clear()
    ax1.imshow(display, cmap=cmap)
    ax1.set_title(f"Mela Crowd Movement - Step {step}")
    plt.pause(0.2)


def plot_blurry_heatmap(heat_data, step, sigma=1.5):
    global fig2, ax2  # So we can recreate ax2 after clearing

    fig2.clf()  # Clear entire figure
    ax2 = fig2.add_subplot(1, 1, 1)  # Recreate axis

    blurred = gaussian_filter(heat_data, sigma=sigma)

    im = ax2.imshow(blurred, cmap='hot', interpolation='bilinear')  # 'hot' = red-orange
    ax2.set_title(f"Blurry Heatmap - Step {step}")
    ax2.axis('off')

    # Add new colorbar
    fig2.colorbar(im, ax=ax2)
    plt.pause(0.2) 

# Run simulation
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
        cumulative_heat[x, y] += 1

    grid = new_grid
    people = new_positions
    plot_grid(grid, step)
    plot_blurry_heatmap(cumulative_heat, step)
