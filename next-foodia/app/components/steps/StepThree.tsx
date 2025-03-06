"use client";
import React from "react";

interface StepThreeProps {
  time: string;
  setTime: React.Dispatch<React.SetStateAction<string>>;
  difficulty: string;
  setDifficulty: React.Dispatch<React.SetStateAction<string>>;
  cost: string;
  setCost: React.Dispatch<React.SetStateAction<string>>;
  servings: number;
  setServings: React.Dispatch<React.SetStateAction<number>>;
}

export default function StepThree({
  time,
  setTime,
  difficulty,
  setDifficulty,
  cost,
  setCost,
  servings,
  setServings,
}: StepThreeProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">
          Let’s get started with some details
        </h1>
        <p className="text-gray-600">
          Estimate time, difficulty, cost and number of servings.
        </p>
      </div>

      {/* TIME */}
      <div className="space-y-2">
        <h2 className="font-semibold">Estimate preparation time</h2>
        <div className="flex flex-col gap-2">
          {/* Quick */}
          <label
            className={`border rounded-md p-3 cursor-pointer hover:bg-gray-50 
              ${
                time === "quick"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300"
              }
            `}
          >
            <input
              type="radio"
              name="time"
              value="quick"
              checked={time === "quick"}
              onChange={() => setTime("quick")}
              className="mr-2"
            />
            <span className="font-medium">Quick (30 minutes or less)</span>
          </label>

          {/* Medium */}
          <label
            className={`border rounded-md p-3 cursor-pointer hover:bg-gray-50 
              ${
                time === "medium"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300"
              }
            `}
          >
            <input
              type="radio"
              name="time"
              value="medium"
              checked={time === "medium"}
              onChange={() => setTime("medium")}
              className="mr-2"
            />
            <span className="font-medium">Medium (30-60 minutes)</span>
          </label>

          {/* Long */}
          <label
            className={`border rounded-md p-3 cursor-pointer hover:bg-gray-50 
              ${
                time === "long"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300"
              }
            `}
          >
            <input
              type="radio"
              name="time"
              value="long"
              checked={time === "long"}
              onChange={() => setTime("long")}
              className="mr-2"
            />
            <span className="font-medium">Long (60+ minutes)</span>
          </label>
        </div>
      </div>

      {/* DIFFICULTY */}
      <div className="space-y-2">
        <h2 className="font-semibold">Difficulty level</h2>
        <div className="flex flex-col gap-2">
          <label
            className={`border rounded-md p-3 cursor-pointer hover:bg-gray-50
              ${
                difficulty === "basic"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300"
              }
            `}
          >
            <input
              type="radio"
              name="difficulty"
              value="basic"
              checked={difficulty === "basic"}
              onChange={() => setDifficulty("basic")}
              className="mr-2"
            />
            <span className="font-medium">
              Basic (Easy, minimal ingredients)
            </span>
          </label>

          <label
            className={`border rounded-md p-3 cursor-pointer hover:bg-gray-50
              ${
                difficulty === "intermediate"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300"
              }
            `}
          >
            <input
              type="radio"
              name="difficulty"
              value="intermediate"
              checked={difficulty === "intermediate"}
              onChange={() => setDifficulty("intermediate")}
              className="mr-2"
            />
            <span className="font-medium">
              Intermediate (Requires some cooking skills)
            </span>
          </label>

          <label
            className={`border rounded-md p-3 cursor-pointer hover:bg-gray-50
              ${
                difficulty === "advanced"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300"
              }
            `}
          >
            <input
              type="radio"
              name="difficulty"
              value="advanced"
              checked={difficulty === "advanced"}
              onChange={() => setDifficulty("advanced")}
              className="mr-2"
            />
            <span className="font-medium">
              Advanced (Techniques and tools are required)
            </span>
          </label>
        </div>
      </div>

      {/* COST */}
      <div className="space-y-2">
        <h2 className="font-semibold">Cost</h2>
        <div className="flex flex-col gap-2">
          <label
            className={`border rounded-md p-3 cursor-pointer hover:bg-gray-50
              ${
                cost === "low"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300"
              }
            `}
          >
            <input
              type="radio"
              name="cost"
              value="low"
              checked={cost === "low"}
              onChange={() => setCost("low")}
              className="mr-2"
            />
            <span className="font-medium">Low</span>
          </label>

          <label
            className={`border rounded-md p-3 cursor-pointer hover:bg-gray-50
              ${
                cost === "medium"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300"
              }
            `}
          >
            <input
              type="radio"
              name="cost"
              value="medium"
              checked={cost === "medium"}
              onChange={() => setCost("medium")}
              className="mr-2"
            />
            <span className="font-medium">Medium</span>
          </label>

          <label
            className={`border rounded-md p-3 cursor-pointer hover:bg-gray-50
              ${
                cost === "high"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300"
              }
            `}
          >
            <input
              type="radio"
              name="cost"
              value="high"
              checked={cost === "high"}
              onChange={() => setCost("high")}
              className="mr-2"
            />
            <span className="font-medium">High</span>
          </label>
        </div>
      </div>

      {/* SERVINGS */}
      <div className="space-y-2">
        <h2 className="font-semibold">Number of servings</h2>
        <input
          type="number"
          min={1}
          value={servings}
          onChange={(e) => setServings(Number(e.target.value))}
          className="border border-gray-300 p-2 rounded-md w-24 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
    </div>
  );
}
