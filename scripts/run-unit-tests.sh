#!/bin/bash

projects=(
    "github-actions-src:yarn test"
    # Add more projects as needed, format: "directory:test_command"
)

for config in "${projects[@]}"; do
    # Split the config string into an array
    IFS=':' read -r -a config_array <<< "$config"

    # Extract the project configuration
    project_dir="${config_array[0]}"
    test_command="${config_array[1]}"

    echo "Running unit tests for project: $project_dir"

    # Navigate to the project directory
    cd "$project_dir" || { echo "Failed to navigate to $project_dir"; exit 1; }

    # Run the test command
    if $test_command; then
        echo "Unit tests passed for $project_dir"
    else
        echo "Unit tests failed for $project_dir"
        exit 1
    fi

    # Navigate back to the root directory
    cd - > /dev/null || exit 1
done

echo "All unit tests executed successfully."
