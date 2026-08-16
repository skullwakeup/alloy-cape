import { useState } from "react";

import { generateIntelligence } from "../services/intelligence";
import { analyzeInvestigation } from "../services/ai/alloyAI";
import {
    generateInvestigationReport,
} from "../services/reports/investigationReport";

import {
    inspectDocument,
} from "../services/investigation/dnaInspector";

import {
    saveInvestigation,
} from "../services/investigation/investigationSupabaseService";

import {
    saveAIReport,
} from "../services/investigation/investigationAIReportService";

import {
    useInvestigations,
} from "../context/InvestigationContext";


export default function useInvestigation() {

    const [loading, setLoading] =
        useState(false);

    const [result, setResult] =
        useState(null);

    const {
        investigations,
        loadInvestigations,
    } = useInvestigations();


    // =====================================================
    // NORMALIZE INVESTIGATION ERRORS
    // =====================================================

    function normalizeInvestigationError(
        error
    ) {

        const rawMessage =
            error?.message ??
            String(error ?? "");


        // -------------------------------------------------
        // Document not registered / DNA not found
        // -------------------------------------------------

        if (

            /no document dna found/i.test(
                rawMessage
            ) ||

            /document dna/i.test(
                rawMessage
            ) ||

            /not found/i.test(
                rawMessage
            ) ||

            /no protected copy/i.test(
                rawMessage
            ) ||

            /no password was found/i.test(
                rawMessage
            ) ||

            /DNA .*not found/i.test(
                rawMessage
            ) ||

            /copy .*not found/i.test(
                rawMessage
            ) ||

            /not present in.*database/i.test(
                rawMessage
            )

        ) {

            return {

                success: false,

                errorType:
                    "DOCUMENT_NOT_IN_DATABASE",

                message:
                    "This document is not registered in the Alloy Cape Registry.",

            };

        }


        // -------------------------------------------------
        // Protected copy could not be matched
        // -------------------------------------------------

        if (

            /password/i.test(
                rawMessage
            ) &&

            /protected/i.test(
                rawMessage
            )

        ) {

            return {

                success: false,

                errorType:
                    "PROTECTED_COPY_NOT_MATCHED",

                message:
                    "This protected PDF could not be matched to a registered recipient copy.",

            };

        }


        // -------------------------------------------------
        // PDF encryption error
        // -------------------------------------------------

        if (

            /encrypted/i.test(
                rawMessage
            ) ||

            /encryption/i.test(
                rawMessage
            )

        ) {

            return {

                success: false,

                errorType:
                    "PDF_ENCRYPTION_ERROR",

                message:
                    "The uploaded PDF is encrypted but could not be processed.",

            };

        }


        // -------------------------------------------------
        // Generic investigation error
        // -------------------------------------------------

        return {

            success: false,

            errorType:
                "INVESTIGATION_ERROR",

            message:
                "Investigation could not be completed.",

        };

    }


    // =====================================================
    // INVESTIGATION
    // =====================================================

    async function investigate(file) {

        setLoading(true);

        setResult(null);


        try {

            // =================================================
            // DOCUMENT INSPECTION
            // =================================================

            const responsePromise =
                inspectDocument(file);


            // Keep the existing investigation animation.
            const animationPromise =
                new Promise(
                    resolve =>
                        setTimeout(
                            resolve,
                            4800
                        )
                );


            const [response] =
                await Promise.all([

                    responsePromise,

                    animationPromise,

                ]);


            // =================================================
            // SUCCESSFUL DOCUMENT
            // =================================================

            if (
                response.success &&
                response.match
            ) {


                // =============================================
                // ALLOY INTELLIGENCE INPUT
                // =============================================

                const investigationData = {

                    integrity:
                        response.match?.integrity ??
                        100,

                    success:
                        response.success,

                    investigatedRecipient:
                        response.recipient,

                    downloads:
                        response.match?.downloadCount ??
                        response.match?.downloads ??
                        0,

                    emailShares:
                        response.match?.emailShares ??
                        0,

                    cloudUploads:
                        response.match?.cloudUploads ??
                        0,

                    externalAccesses:
                        response.match?.externalAccesses ??
                        0,

                    passwordReveals:
                        response.match?.passwordReveals ??
                        response.match?.passwordRevealCount ??
                        0,

                    tampered:
                        response.match?.tampered ??
                        response.tampered ??
                        false,

                    semanticScore:
                        response.semanticScore ??
                        0,

                    leakProbability: response.leakProbability ?? 0,
                    leakLevel: response.leakLevel ?? "Minimal",
                    recipientType: response.recipientType ?? response.attribution?.recipientType ?? "UNKNOWN",

                };


               
                // =============================================
                // GENERATE INTELLIGENCE
                // =============================================

                const intelligence =
                    generateIntelligence({

                        document:
                            response.match,

                        investigation:
                            investigationData,

                        investigations,

                    });


                // =============================================
                // ALLOY AI
                // =============================================


                const aiAnalysis =
                    await analyzeInvestigation({

                        document:
                            response.match,

                        investigation:
                            response,

                        intelligence,

                    });


                // =============================================
                // SAVE INVESTIGATION
                // =============================================

                const savedInvestigation =
                    await saveInvestigation(

                        {

                            ...response.match,

                            investigatedRecipient:
                                response.recipient,

                        },

                        {

                            ...response,

                            status:
                                "Investigated",

                            risk:
                                intelligence.risk.level,

                            passwordReveals:
                                investigationData.passwordReveals,

                        }

                    );



                // =============================================
                // SAVE AI REPORT
                // =============================================

                await saveAIReport(

                    savedInvestigation.id,

                    intelligence,

                    aiAnalysis,

                );


                // =============================================
                // RELOAD INVESTIGATIONS
                // =============================================

                await loadInvestigations();


                // =============================================
                // FINAL RESULT
                // =============================================

                const finalResult = {

                    ...response,

                    intelligence,

                    aiAnalysis,

                    investigationId:
                        savedInvestigation.id,

                };


                // =============================================
                // AUTOMATIC INVESTIGATION REPORT
                // =============================================

                /*
                 * PDF generation is deliberately isolated
                 * from the investigation itself.
                 *
                 * If the report generator fails,
                 * the investigation remains successful.
                 */

                try {


                    generateInvestigationReport(
                        finalResult
                    );

                }

                catch (reportError) {

                    console.error(
                        "Investigation report generation failed:",
                        reportError
                    );

                }


                // =============================================
                // SHOW RESULT
                // =============================================

                setResult(
                    finalResult
                );

            }


            // =================================================
            // INSPECTION RETURNED A FAILURE
            // =================================================

            else {

                setResult(

                    normalizeInvestigationError(
                        response
                    )

                );

            }

        }


        // =====================================================
        // UNEXPECTED / THROWN ERROR
        // =====================================================

        catch (error) {

            console.error(
                error
            );


            setResult(

                normalizeInvestigationError(
                    error
                )

            );

        }


        // =====================================================
        // FINISH
        // =====================================================

        finally {

            setLoading(
                false
            );

        }

    }


    // =====================================================
    // HOOK RETURN
    // =====================================================

    return {

        loading,

        result,

        investigate,

    };

}