<?php

namespace Inimedia\Foundation;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller as BaseController;
use Illuminate\Support\Facades\Validator;

class FineUploaderController extends BaseController
{
    public function __construct(){
    }

    public function upload(Request $request) {

        $v = Validator::make($request->all(), [
            'qqfile' => 'required',
            'qquuid' => 'required',
            'qqtotalfilesize' => 'required',
            'qqfilename' => 'required'
        ]);

        if ($v->fails())
        {
            return response()->json([
                'status' => 'error',
                'errors' => $v->errors(),
            ], 400);
        }

        $file = $request->file('qqfile');
        $filetype = $file->getMimeType();

        $media_path = public_path('uploads/media');
        if (!\File::exists($media_path)) {
            \File::makeDirectory($media_path, $mode = 0777, true, true);
        }

        try {
            $media_dir = public_path('uploads/media/' . $request->qquuid . '/');
            if (!\File::exists($media_dir)) {
                \File::makeDirectory($media_dir, $mode = 0777, true, true);
            }
            $file->move($media_dir, $request->qqfilename);
        } catch (\Exception $e) {
            \Log::error($e->getTraceAsString());
            return response()->json([
                'success' => false,
                'error' => 'Unknown error while creating container directory for ' . $request->qqfilename
            ]);
        }

        try {
            $dbFile = new UploadedFile();
            $dbFile->uuid = $request->qquuid;
            $dbFile->filename = $request->qqfilename;
            $dbFile->filesize = $request->qqtotalfilesize;
            $dbFile->filetype = $filetype;
            $dbFile->tag = '';
            $dbFile->save();
        } catch (\Exception $e) {
            \File::deleteDirectory($media_dir);
            \Log::error($e->getTraceAsString());
            return response()->json([
                'success' => false,
                'error' => 'Unknown error while uploading ' . $request->qqfilename
            ]);
        }

        return response()->json([
            'success' => true,
            'result' => $dbFile
        ]);
    }

    public function delete($uuid) {
        $media_dir = public_path('uploads/media/' . $uuid . '/');
        if (\File::exists($media_dir)) {
            if (\File::deleteDirectory($media_dir)) {
                $dbFile = UploadedFile::where('uuid', $uuid)->first();
                UploadedFile::where('uuid', $uuid)->delete();
                return response()->json([
                    'success' => true,
                    'result' => $dbFile
                ]);
            }
            else {
                return response()->json([
                    'success' => false,
                    'error' => 'cannot delete container directory, please check directory permission!'
                ]);
            }
        }
        else {
            return response()->json([
                'success' => true,
                'result' => null
            ]);
        }
    }
}
