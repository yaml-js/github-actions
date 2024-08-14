#!/bin/bash

projects=(
    "github-actions-src:yarn install && yarn test"
    # Add more projects as needed, format: "directory:test_command"
)

for config in "${projects[@]}"; do
    # Split the config string into an array
    IFS=':' read -r -a config_array <<< "$config"

    # Extract the project configuration
    project_dir="${config_array[0]}"
    test_commands="${config_array[1]}"

    echo "Running unit tests for project: $project_dir"

    # Navigate to the project directory
    cd "$project_dir" || { echo "Failed to navigate to $project_dir"; exit 1; }

    # Run test commands if they are provided
    if [ -n "$test_commands" ]; then
        echo "Running test commands for $project_dir"
        IFS='&&' read -r -a commands <<< "$test_commands"
        for cmd in "${commands[@]}"; do
            echo "Executing: $cmd"
            if ! eval "$cmd"; then
                echo "Command failed: $cmd for $project_dir"
                exit 1
            fi
        done
    fi

    # Navigate back to the root directory
    cd - > /dev/null || exit 1
done

echo "All unit tests executed successfully."
