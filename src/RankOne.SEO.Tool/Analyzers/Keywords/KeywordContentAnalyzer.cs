﻿using System.Linq;
using System.Text.RegularExpressions;
using HtmlAgilityPack;
using RankOne.Attributes;
using RankOne.Models;

namespace RankOne.Analyzers.Keywords
{
    [AnalyzerCategory(SummaryName = "Keywords", Alias = "keywordcontentanalyzer")]
    public class KeywordContentAnalyzer : BaseAnalyzer
    {
        public override AnalyzeResult Analyse(HtmlNode document, string focuskeyword, string url)
        {
            var result = new AnalyzeResult
            {
                Alias = "keywordcontentanalyzer"
            };

            var bodyTags = HtmlHelper.GetElements(document, "body");

            if (!bodyTags.Any())
            {
                result.AddResultRule("keywordcontentanalyzer_no_body_tag", ResultType.Warning);
            }
            else if (bodyTags.Count() > 1)
            {
                result.AddResultRule("keywordcontentanalyzer_multiple_body_tags", ResultType.Warning);
            }
            else
            {
                var bodyTag = bodyTags.FirstOrDefault();

                if (bodyTag != null)
                {
                    var text = Regex.Replace(bodyTag.InnerText.Trim().ToLower(), @"\s+", " ");

                    var matches = Regex.Matches(text, focuskeyword);

                    if (matches.Count == 0)
                    {
                        result.AddResultRule("keywordcontentanalyzer_content_doesnt_contain_keyword", ResultType.Warning);
                    }
                    else
                    {
                        var resultRule = new ResultRule
                        {
                            Alias = "keywordcontentanalyzer_content_contains_keyword",
                            Type = ResultType.Success
                        };
                        resultRule.Tokens.Add(matches.Count.ToString());
                        result.ResultRules.Add(resultRule);
                    }
                }
            }

            return result;
        }
    }
}
