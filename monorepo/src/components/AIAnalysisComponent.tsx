import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Target, 
  Zap, 
  Shield,
  Brain,
  BarChart3
} from "lucide-react";

interface CoinPredictiveAnalysis {
  opportunities?: string[];
  prediction_type?: string;
  riskFactors?: string[];
  timeframe?: string;
  successProbability?: string;
}

interface CoinAnalysis {
  analysisAspects?: string[];
  coinPotential?: string;
  strengths?: string[];
  weaknesses?: string;
}

interface AIAnalysisProps {
  coinPredictiveAnalysis?: CoinPredictiveAnalysis;
  coinAnalysis?: CoinAnalysis;
}

const AIAnalysisComponent: React.FC<AIAnalysisProps> = ({ 
  coinPredictiveAnalysis, 
  coinAnalysis 
}) => {
  // Don't render if no analysis data is provided
  if (!coinPredictiveAnalysis && !coinAnalysis) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">AI Analysis</h3>
      </div>

      <div className="space-y-4">
        {/* Predictive Analysis Card */}
        {coinPredictiveAnalysis && (
          <Card className="border-gray-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-gray-900">
                <BarChart3 className="h-4 w-4" />
                Predictive Analysis
              </CardTitle>
              {coinPredictiveAnalysis.prediction_type && (
                <CardDescription className="text-gray-600">
                  {coinPredictiveAnalysis.prediction_type}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Success Probability */}
              {coinPredictiveAnalysis.successProbability && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Success Probability</span>
                  </div>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                    {coinPredictiveAnalysis.successProbability}
                  </Badge>
                </div>
              )}

              {/* Timeframe */}
              {coinPredictiveAnalysis.timeframe && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Timeframe</span>
                  </div>
                  <Badge variant="outline" className="border-gray-300 text-gray-700">
                    {coinPredictiveAnalysis.timeframe}
                  </Badge>
                </div>
              )}

              {coinPredictiveAnalysis.opportunities && coinPredictiveAnalysis.opportunities.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Opportunities</span>
                  </div>
                  <div className="space-y-2">
                    {coinPredictiveAnalysis.opportunities.map((opportunity, index) => (
                      <div key={index} className="text-sm text-gray-700 bg-gray-50 p-2 rounded-md">
                        {opportunity}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {coinPredictiveAnalysis.riskFactors && coinPredictiveAnalysis.riskFactors.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Risk Factors</span>
                  </div>
                  <div className="space-y-2">
                    {coinPredictiveAnalysis.riskFactors.map((risk, index) => (
                      <div key={index} className="text-sm text-gray-700 bg-gray-50 p-2 rounded-md border-l-2 border-gray-400">
                        {risk}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        {coinAnalysis && (
          <Card className="border-gray-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-gray-900">
                <Zap className="h-4 w-4" />
                Coin Analysis
              </CardTitle>
              {coinAnalysis.coinPotential && (
                <CardDescription className="text-gray-600">
                  {coinAnalysis.coinPotential}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {coinAnalysis.analysisAspects && coinAnalysis.analysisAspects.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Analysis Aspects</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {coinAnalysis.analysisAspects.map((aspect, index) => (
                      <Badge key={index} variant="outline" className="border-gray-300 text-gray-700">
                        {aspect}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths */}
              {coinAnalysis.strengths && coinAnalysis.strengths.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Strengths</span>
                  </div>
                  <div className="space-y-2">
                    {coinAnalysis.strengths.map((strength, index) => (
                      <div key={index} className="text-sm text-gray-700 bg-gray-50 p-2 rounded-md border-l-2 border-green-400">
                        {strength}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Weaknesses */}
              {coinAnalysis.weaknesses && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Weaknesses</span>
                  </div>
                  <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded-md border-l-2 border-red-400">
                    {coinAnalysis.weaknesses}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Separator className="my-4 bg-gray-200" />
    </div>
  );
};

export default AIAnalysisComponent;